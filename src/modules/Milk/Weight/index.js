import React, { useCallback, useEffect, useState } from 'react';
import { getFirestoreCollection } from 'services/firebase';
import PageTitle from 'ui/components/common/Pages/PageTitle';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import ExcelUploadButton from 'ui/components/common/UploadFromExcel/ExcelUploadButton';
import { showLog } from 'utils/functions/common';
import { ROW_GUTTER } from 'constants/Styles';
import { Row, Col, Form } from 'antd';
import DatePicker from 'ui/elements/DatePicker';
import dayjs from 'dayjs';
import { getMilkColumns, milk_columns } from './api';
import { showWarn } from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';

const Weight = () => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [date, setDate] = useState([
    dayjs().subtract(1, 'M').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const getWeights = useCallback(
    async (dateRange) => {
      try {
        setLoading(true);
        const weights = await getFirestoreCollection(
          'sections/milk/weight',
          dateRange
            ? [
                ['recordDate', '>=', dateRange[0]],
                ['recordDate', '<=', dateRange[1]],
              ]
            : null
        );
        const arr = weights
          ? Object.keys(weights).map((k, id) => ({
              ...weights[k],
              id,
              key: id,
              _id: k,
            }))
          : [];
        showLog({ arr, weights });
        setLoading(false);
        setData(arr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  const handleSelect = (e) => {};

  useEffect(() => {
    getWeights(date);
  }, [date, getWeights]);

  const onDateChange = (range) => {
    showLog({ range });
    let nRange = [
      dayjs(range[0], 'DD/MM/YYYY').format('YYYY-MM-DD'),
      dayjs(range[1], 'DD/MM/YYYY').format('YYYY-MM-DD'),
    ];
    setDate(nRange);
  };
  return (
    <div className="h-full p-2">
      <PageTitle title="น้ำหนักน้ำนมดิบ" subtitle="รุ่งอรุณ แดรี่" />
      <div>
        <Row gutter={ROW_GUTTER}>
          <Col span={24} sm={12}>
            <ExcelUploadButton
              className="my-3 mb-4"
              dataType="weight"
              title={
                <span>
                  นำเข้าไฟล์ข้อมูลน้ำหนักน้ำนมดิบ{' '}
                  <span className="text-success">(xls, xlsx)</span>
                </span>
              }
            />
          </Col>
          <Col
            span={24}
            sm={12}
            className="flex flex-col"
            style={{ display: 'flex' }}
          >
            <label className="mb-1">ช่วงเวลา (ที่แสดงข้อมูลในตาราง)</label>
            <DatePicker
              label="ช่วงเวลา"
              isRange
              value={date}
              onChange={onDateChange}
            />
          </Col>
        </Row>

        <EditableCellTable
          dataSource={data}
          columns={getMilkColumns(data)}
          loading={loading}
          // reset={reset}
          handleEdit={handleSelect}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: () => handleSelect(record),
          //   };
          // }}
          // hasEdit
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </div>
  );
};

export default Weight;
