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
import { getRangeSummaryReportColumns } from './helper';
import { distinctArr } from 'utils/functions/array';
import { arrayForEach } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';
import MemberSelector from 'ui/components/MemberSelector';
import { Col, Form, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import { ROW_GUTTER } from 'constants/Styles';
import { getRules } from 'utils/functions/validator';
import { useTranslation } from 'react-i18next';
import Button from 'ui/elements/Button';
import { CheckOutlined } from '@ant-design/icons';
import { getFirestoreDoc } from 'services/firebase';
import { formatValuesBeforeLoad } from 'utils/functions/common';
import { TableSummary } from 'ui/components/common/Table';
import { useSelector } from 'react-redux';
import { findMaxValueByKey } from 'utils/functions/number';

const RangeSummaryReport = ({ children, title, subtitle, ...props }) => {
  const { USER, profile } = useSelector((state) => state.user);
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);

  const [form] = Form.useForm();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const getRangeSum = useCallback(
    async (val) => {
      try {
        setLoading(true);
        const { dateRange } = val;
        const res = await getFirestoreCollection('sections/milk/weight', [
          ['recordDate', '>=', dateRange[0]],
          ['recordDate', '<=', dateRange[1]],
        ]);
        let arr = res
          ? Object.keys(res).map((k) => ({
              ...res[k],
              _id: k,
            }))
          : [];
        showLog({ arr });
        arr = sortArr(arr, ['recordDate']).map((it, id) => ({
          ...it,
          id,
          key: id,
        }));

        let dArr = distinctArr(
          arr,
          ['memberId', 'recordDate', 'period'],
          ['weight']
        );

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
          if (!fObj[`${recordDate}${memberId}`]) {
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
                key: k,
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
                key: k,
                _id: k,
              }));
            }
            showLog({ qUnitPriceArr });
            let qUnitPrice = null;
            let isFirstHalf = dayjs(recordDate, 'YYYY-MM-DD').format('DD') < 16;
            showLog({ recordDate, isFirstHalf });
            let qArr = qUnitPriceArr.filter(
              (l) =>
                l.affectingPeriod === (isFirstHalf ? 'firstHalf' : 'secondHalf')
            );
            if (qArr.length > 0) {
              const { fat_price, snf_price, scc_price, fp_price } = qArr[0];
              qUnitPrice =
                Numb(fat_price) +
                Numb(snf_price) +
                Numb(scc_price) +
                Numb(fp_price);
            }

            fObj[`${recordDate}${memberId}`] = {
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
              fObj[`${recordDate}${memberId}`].morningW = weight;
            } else {
              fObj[`${recordDate}${memberId}`].eveningW = weight;
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

        let dfArr = distinctArr(
          fArr,
          ['memberId'],
          ['morningW', 'eveningW', 'totalW', 'weight', 'amount']
        );

        let maxUnitPrice = findMaxValueByKey(dfArr, 'unitPrice');
        let result = dfArr.map((l) => ({
          ...l,
          belowStandard: Numb(l.unitPrice) < maxUnitPrice,
        }));

        showLog({ arr, dArr, fArr, dfArr, res });
        setLoading(false);
        setData(result);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  const onSubmit = (val) => {
    showLog('onSubmit', val);
    getRangeSum(val);
  };

  return (
    <Page title="สรุปตามช่วงเวลา" subtitle="รุ่งอรุณ แดรี่">
      <Form
        form={form}
        initialValues={{
          dateRange: [
            dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
            dayjs().format('YYYY-MM-DD'),
          ],
        }}
        onValuesChange={() => setData([])}
        onFinish={onSubmit}
        layout="vertical"
        scrollToFirstError
      >
        {(values) => {
          return (
            <div className="py-2">
              <div className="pt-6 rounded-lg bg-background2 px-2">
                <Row gutter={ROW_GUTTER}>
                  <Col span={mobileOnly ? 32 : 8}>
                    <Form.Item
                      name="dateRange"
                      label="วันที่"
                      rules={getRules(['required'])}
                    >
                      <DatePicker isRange />
                    </Form.Item>
                  </Col>
                  <Col span={mobileOnly ? 24 : 6}>
                    <span className="mx-2"></span>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<CheckOutlined />}
                      className="mt-2"
                    >
                      {t('ตกลง').toUpperCase()}
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          );
        }}
      </Form>

      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getRangeSummaryReportColumns(data)}
          summary={(pageData) => (
            <TableSummary
              pageData={pageData}
              startAt={1}
              columns={getRangeSummaryReportColumns(data)}
              sumKeys={['morningW', 'eveningW', 'totalW', 'amount']}
              sumClassName={['text-primary', 'text-success']}
            />
          )}
          loading={loading}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default RangeSummaryReport;
