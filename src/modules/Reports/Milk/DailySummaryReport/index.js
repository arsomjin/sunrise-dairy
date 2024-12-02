import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import React, { useCallback, useEffect, useState } from 'react';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import { sortArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { getDailySummaryReportColumns } from './api';
import { distinctArr } from 'utils/functions/array';
import { arrayForEach } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';
import { TableSummary } from 'ui/components/common/Table';

const DailySummaryReport = ({ children, title, subtitle, ...props }) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const getDailySummary = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/milk/weight', [
          ['recordDate', '==', sDate],
        ]);
        let arr = res
          ? Object.keys(res).map((k) => ({
              ...res[k],
              _id: k,
              // nameSurname: `${res[k].prefix}${res[k].firstName} ${
              //   res[k].lastName || ''
              // }`,
            }))
          : [];
        arr = sortArr(arr, ['memberId']).map((it, id) => ({
          ...it,
          id,
          key: id,
        }));

        let dArr = distinctArr(arr, ['memberId', 'period'], ['weight']);

        let fObj = {};
        await arrayForEach(dArr, async (l, i) => {
          const {
            memberId,
            nameSurname,
            period,
            recordDate,
            systemDate,
            weight,
          } = l;
          if (!fObj[memberId]) {
            // Get daily QC price.
            const res = await getFirestoreCollection('sections/milk/dailyQC', [
              ['recordDate', '==', recordDate],
              ['bucketNo', '==', memberId],
            ]);
            let unitPriceArr = [];
            if (res) {
              unitPriceArr = Object.keys(res).map((k, id) => ({
                ...res[k],
                id,
                key: id,
                _id: k,
              }));
            }
            let unitPrice =
              unitPriceArr.length > 0 ? unitPriceArr[0].price_per_kg : null;

            // Get milk QC price.
            const res2 = await getFirestoreCollection('sections/milk/milkQC', [
              [
                'recordMonth',
                '==',
                dayjs(recordDate, 'YYYY-MM-DD').format('YYYY-MM'),
              ],
              ['bucketNo', '==', memberId],
            ]);
            let qUnitPriceArr = [];
            if (res2) {
              qUnitPriceArr = Object.keys(res2).map((k, id) => ({
                ...res2[k],
                id,
                key: id,
                _id: k,
              }));
            }
            let qUnitPrice = null;
            let isFirstHalf = dayjs(recordDate, 'YYYY-MM-DD').format('DD') < 16;
            let qArr = qUnitPriceArr.filter(
              (l) =>
                l.affectingPeriod === (isFirstHalf ? 'firstHalf' : 'secondHalf')
            );
            // showLog({ isFirstHalf });
            if (qArr.length > 0) {
              const { fat_price, snf_price, scc_price, fp_price } = qArr[0];
              qUnitPrice =
                Numb(fat_price) +
                Numb(snf_price) +
                Numb(scc_price) +
                Numb(fp_price);
            }

            fObj[memberId] = {
              memberId,
              nameSurname,
              recordDate,
              morningW: period === 'เช้า' ? weight : null,
              eveningW: period === 'เย็น' ? weight : null,
              unitPrice:
                unitPriceArr.length > 0 ? unitPriceArr[0].price_per_kg : null,
              qUnitPrice,
              accUnitPrice: Numb(unitPrice) + Numb(qUnitPrice),
            };
          } else {
            if (period === 'เช้า') {
              fObj[memberId].morningW = weight;
            } else {
              fObj[memberId].eveningW = weight;
            }
          }
          return l;
        });

        let fArr = Object.keys(fObj).map((k, id) => {
          let totalW = Numb(fObj[k].morningW) + Numb(fObj[k].eveningW);
          const amount = totalW * Numb(fObj[k].accUnitPrice);
          return {
            ...fObj[k],
            totalW,
            amount,
            id,
            key: k,
          };
        });

        showLog({ arr, dArr, fArr, res });
        setLoading(false);
        setData(fArr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  useEffect(() => {
    getDailySummary(date);
  }, [date, getDailySummary]);

  const onDateChange = async (val) => {
    try {
      setDate(val);
    } catch (e) {
      showWarn(e);
    }
  };

  return (
    <Page title="สรุปประจำวัน" subtitle="รุ่งอรุณ แดรี่">
      <span className="mx-2 text-muted">วันที่</span>
      <DatePicker value={date} onChange={onDateChange} />
      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getDailySummaryReportColumns(data)}
          loading={loading}
          summary={(pageData) => (
            <TableSummary
              pageData={pageData}
              startAt={4}
              columns={getDailySummaryReportColumns(data)}
              sumKeys={['totalW', 'amount']}
              sumClassName={['text-primary', 'text-success']}
            />
          )}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default DailySummaryReport;
