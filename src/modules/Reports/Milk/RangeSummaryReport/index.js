import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import { showLog } from 'utils/functions/common';
import { fetchAndProcessData, getRangeSummaryReportColumns } from './helper';
import { Col, Form, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import { ROW_GUTTER } from 'constants/Styles';
import { getRules } from 'utils/functions/validator';
import { useTranslation } from 'react-i18next';
import Button from 'ui/elements/Button';
import { CheckOutlined } from '@ant-design/icons';
import { TableSummary } from 'ui/components/common/Table';

const RangeSummaryReport = ({ children, title, subtitle, ...props }) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  // Handle form submission by fetching and processing the data.
  const onSubmit = async (values) => {
    showLog('onSubmit', values);
    const result = await fetchAndProcessData(values.dateRange, setLoading);
    setData(result);
  };

  // Pre-calculate columns only once per render
  const columns = getRangeSummaryReportColumns(data);

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
                {!mobileOnly && <span className="mx-2"></span>}
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  className={mobileOnly ? 'ml-2' : 'mt-2 ml-2'}
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
          columns={columns}
          summary={(pageData) => (
            <TableSummary
              pageData={pageData}
              startAt={1}
              columns={columns}
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
