import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import React, { useCallback, useEffect, useState } from 'react';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import { distinctArr } from 'utils/functions/array';
import { sortArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { getQCResultColumns } from './helper';

const QCResult = ({ children, title, subtitle, ...props }) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [aDate, setAvailableDate] = useState([]);

  const getQCResult = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/milk/milkQC', [
          ['recordDate', '==', sDate],
        ]);
        let arr = res
          ? Object.keys(res).map((k) => ({
              ...res[k],
              _id: k,
              nameSurname: `${res[k].prefix}${res[k].firstName} ${
                res[k].lastName || ''
              }`,
            }))
          : [];
        arr = sortArr(arr, ['bucketNo']).map((it, id) => ({
          ...it,
          id,
          key: id,
        }));
        showLog({ arr, res });
        setLoading(false);
        setData(arr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  const getQCDates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFirestoreCollection('sections/milk/milkQC_dates');
      let avai = res ? Object.keys(res).map((k) => k) : [];
      setAvailableDate(avai);
      showLog({ avai });
    } catch (e) {
      showWarn(e);
    }
  }, [setLoading]);

  useEffect(() => {
    getQCResult(date);
    getQCDates();
  }, [date, getQCDates, getQCResult]);

  const disabledDate = (current) =>
    !aDate.includes(current.format('YYYY-MM-DD'));

  const onDateChange = async (val) => {
    try {
      setDate(val);
    } catch (e) {
      showWarn(e);
    }
  };

  return (
    <Page title="ผลตรวจวิเคราะห์คุณภาพน้ำนมดิบ" subtitle="รุ่งอรุณ แดรี่">
      <span className="mx-2 text-muted">วันที่</span>
      <DatePicker
        value={date}
        onChange={onDateChange}
        disabledDate={disabledDate}
      />
      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getQCResultColumns(data)}
          loading={loading}
          // handleEdit={handleSelect}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: () => handleSelect(record),
          //   };
          // }}
          // hasEdit
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default QCResult;
