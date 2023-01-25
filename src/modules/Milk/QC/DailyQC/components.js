import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, InputNumber, Slider } from 'antd';
import { ROW_GUTTER } from 'constants/Styles';
import Button from 'ui/elements/Button';
import DatePicker from 'ui/elements/DatePicker';
import Input from 'ui/elements/Input';
import { getRules } from 'utils/functions/validator';

export const renderDailyQCBody = ({
  mobileOnly,
  prefixSelector,
  t,
  onClear,
  onDelete,
  isModal,
}) => (
  <div className="py-2">
    <div className="pt-6 rounded-lg bg-background2 px-2">
      <Row gutter={ROW_GUTTER}>
        <Col span={mobileOnly ? 24 : 6}>
          <Form.Item
            name="bucketNo"
            label="เบอร์ถัง"
            rules={getRules(['required', 'number'])}
          >
            <Input readOnly={isModal} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 24 : 8}>
          <Form.Item
            name="firstName"
            label={t('ชื่อ')}
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Input addonBefore={prefixSelector} readOnly={isModal} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 24 : 10}>
          <Form.Item
            name="lastName"
            label={t('นามสกุล')}
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Input readOnly={isModal} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={ROW_GUTTER}>
        <Col span={mobileOnly ? 12 : 6}>
          <Form.Item
            name="recordDate"
            label="วันที่"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <DatePicker
              style={{
                fontWeight: 'bold',
              }}
              disabled={isModal}
            />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 12 : 6}>
          <Form.Item
            name="startTime"
            label="เริ่มเวลา"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <DatePicker picker="time" />
            {/* <TimePicker
              // defaultValue={dayjs().format('HH:mm')}
              format="HH:mm"
              style={{
                fontWeight: 'bold',
              }}
            /> */}
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 16 : 8}>
          <Form.Item
            name="theHour"
            label="ชั่วโมงที่"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Slider min={0} max={10} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 8 : 4}>
          <Form.Item
            name="theHour"
            label="ชั่วโมง"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <InputNumber
              min={0}
              max={10}
              style={{
                margin: '0 16px',
                fontWeight: 'bold',
              }}
              step={0.01}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-center py-4 border-t">
        {!isModal ? (
          <Button style={{ marginRight: 20 }} onClick={onClear}>
            {t('ล้างข้อมูล').toUpperCase()}
          </Button>
        ) : (
          <Button
            danger
            type="primary"
            onClick={onDelete}
            icon={<CloseOutlined />}
            style={{ marginRight: 20 }}
          >
            ลบข้อมูล
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          icon={isModal ? <CheckOutlined /> : <PlusOutlined />}
        >
          {t('บันทึก').toUpperCase()}
        </Button>
      </div>
    </div>
    <div className="h-36" />
  </div>
);
