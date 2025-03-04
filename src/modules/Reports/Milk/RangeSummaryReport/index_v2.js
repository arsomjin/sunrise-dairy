import React, { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import Button from 'ui/elements/Button';
import { CheckOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import { ROW_GUTTER } from 'constants/Styles';
import { useTranslation } from 'react-i18next';
import { getRules } from 'utils/functions/validator';
import { sortArr, distinctArr } from 'utils/functions/array';
import { showLog, showWarn, Numb } from 'utils/functions/common';
import { getRangeSummaryReportColumns } from './helper';
import { TableSummary } from 'ui/components/common/Table';
import { findMaxValueByKey } from 'utils/functions/number';

// Helper function to convert Firestore object to an array.
const firestoreObjToArray = (obj) =>
  obj ? Object.keys(obj).map((key) => ({ ...obj[key], _id: key })) : [];

const RangeSummaryReport = ({
  title = 'สรุปตามช่วงเวลา',
  subtitle = 'รุ่งอรุณ แดรี่',
}) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const getRangeSum = useCallback(
    async (values) => {
      try {
        setLoading(true);
        const { dateRange } = values;
        // Fetch weight records within the selected date range.
        const weightRecordsData = await getFirestoreCollection(
          'sections/milk/weight',
          [
            ['recordDate', '>=', dateRange[0]],
            ['recordDate', '<=', dateRange[1]],
          ]
        );
        let weightRecords = firestoreObjToArray(weightRecordsData);
        weightRecords = sortArr(weightRecords, ['recordDate']).map(
          (record, index) => ({
            ...record,
            id: index,
            key: index,
          })
        );

        // Remove duplicate records based on memberId, recordDate, and period.
        const distinctWeightRecords = distinctArr(
          weightRecords,
          ['memberId', 'recordDate', 'period'],
          ['weight']
        );

        const aggregatedRecords = {};

        // Process each record and aggregate data.
        for (const record of distinctWeightRecords) {
          const { memberId, nameSurname, period, recordDate, weight } = record;
          const recordKey = `${recordDate}${memberId}`;

          if (!aggregatedRecords[recordKey]) {
            // Fetch daily QC price.
            const dailyQCData = await getFirestoreCollection(
              'sections/milk/dailyQC',
              [
                ['recordDate', '==', recordDate],
                ['bucketNo', '==', memberId],
              ]
            );
            const dailyQCRecords = firestoreObjToArray(dailyQCData);
            const unitPrice =
              dailyQCRecords.length > 0 ? dailyQCRecords[0].price_per_kg : null;

            // Fetch milk QC price.
            const formattedMonth = dayjs(recordDate, 'YYYY-MM-DD').format(
              'YYYY-MM'
            );
            const milkQCData = await getFirestoreCollection(
              'sections/milk/milkQC',
              [
                ['recordMonth', '==', formattedMonth],
                ['bucketNo', '==', memberId],
              ]
            );
            const milkQCRecords = firestoreObjToArray(milkQCData);
            const isFirstHalf = dayjs(recordDate).date() < 16;
            const periodFilter = isFirstHalf ? 'firstHalf' : 'secondHalf';
            const filteredMilkQC = milkQCRecords.filter(
              (item) => item.affectingPeriod === periodFilter
            );
            let qUnitPrice = null;
            if (filteredMilkQC.length > 0) {
              const { fat_price, snf_price, scc_price, fp_price } =
                filteredMilkQC[0];
              qUnitPrice =
                Numb(fat_price) +
                Numb(snf_price) +
                Numb(scc_price) +
                Numb(fp_price);
            }

            aggregatedRecords[recordKey] = {
              memberId,
              nameSurname,
              recordDate,
              morningW: period === 'เช้า' ? weight : null,
              eveningW: period === 'เย็น' ? weight : null,
              unitPrice,
              qUnitPrice,
              accUnitPrice: Numb(unitPrice) + Numb(qUnitPrice),
            };
          } else {
            if (period === 'เช้า') {
              aggregatedRecords[recordKey].morningW = weight;
            } else if (period === 'เย็น') {
              aggregatedRecords[recordKey].eveningW = weight;
            }
          }
        }

        // Convert the aggregated records into an array and calculate totals.
        const finalArray = Object.keys(aggregatedRecords).map((key, index) => {
          const record = aggregatedRecords[key];
          const totalW = Numb(record.morningW) + Numb(record.eveningW);
          const amount = totalW * Numb(record.accUnitPrice);
          return {
            ...record,
            totalW,
            amount,
            id: index,
            key,
          };
        });

        // Remove duplicates by memberId and aggregate the necessary columns.
        const distinctFinalRecords = distinctArr(
          finalArray,
          ['memberId'],
          ['morningW', 'eveningW', 'totalW', 'amount']
        );

        const maxUnitPrice = findMaxValueByKey(
          distinctFinalRecords,
          'unitPrice'
        );
        const result = distinctFinalRecords.map((record) => ({
          ...record,
          belowStandard: Numb(record.unitPrice) < maxUnitPrice,
        }));

        showLog({
          weightRecords,
          distinctWeightRecords,
          finalArray,
          distinctFinalRecords,
        });
        setData(result);
        setLoading(false);
      } catch (error) {
        showWarn(error);
        setLoading(false);
      }
    },
    [setLoading]
  );

  const onSubmit = (values) => {
    showLog('onSubmit', values);
    getRangeSum(values);
  };

  return (
    <Page title={title} subtitle={subtitle}>
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
