import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import React, { useCallback, useEffect, useState } from 'react';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { getQCResultColumns } from './api';

const QCResult = ({ children, title, subtitle, ...props }) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const getQCResult = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/milk/milkQC', [
          ['recordDate', '==', sDate],
        ]);
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: id,
              _id: k,
              nameSurname: `${res[k].prefix}${res[k].firstName} ${
                res[k].lastName || ''
              }`,
            }))
          : [];
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

  useEffect(() => {
    getQCResult(date);
  }, [date, getQCResult]);

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
      <DatePicker value={date} onChange={onDateChange} />
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
