import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, InputNumber, Slider } from 'antd';
import { ROW_GUTTER } from 'constants/Styles';
import Button from 'ui/elements/Button';
import DatePicker from 'ui/elements/DatePicker';
import Input from 'ui/elements/Input';
import { getRules } from 'utils/functions/validator';

export const renderMilkQCBody = ({
  mobileOnly,
  prefixSelector,
  t,
  onClear,
  onDelete,
  isModal,
}) => (
  <div className="py-2">
    <div className="pt-6 rounded-lg bg-background2 px-2">
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
        <Col span={mobileOnly ? 16 : 8}>
          <Form.Item
            name="fat"
            label="ปริมาณไขมัน"
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
            name="fat"
            label="%"
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
              placeholder="3.4"
            />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 16 : 8}>
          <Form.Item
            name="snf"
            label="ปริมาณเนื้อนมไม่รวมไขมันเนย"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Slider min={5} max={10} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 8 : 4}>
          <Form.Item
            name="snf"
            label="%"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <InputNumber
              min={5}
              max={10}
              style={{
                margin: '0 16px',
                fontWeight: 'bold',
              }}
              step={0.01}
              placeholder="8.35"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={ROW_GUTTER}>
        <Col span={mobileOnly ? 16 : 8}>
          <Form.Item
            name="scc"
            label="เต้านมอักเสบ"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Slider min={0} max={2000000} step={1} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 8 : 4}>
          <Form.Item
            name="scc"
            label="เซลล์ / มิลลิลิตร"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <InputNumber
              min={0}
              max={2000000}
              step={1}
              style={{
                margin: '0 16px',
                fontWeight: 'bold',
              }}
              placeholder="400,001"
            />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 16 : 8}>
          <Form.Item
            name="fp"
            label="จุดเยือกแข็ง ℃"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <Slider min={-1} max={0} step={0.001} />
          </Form.Item>
        </Col>
        <Col span={mobileOnly ? 8 : 4}>
          <Form.Item
            name="fp"
            label="℃"
            rules={[
              {
                required: true,
                message: t('กรุณาป้อนข้อมูล'),
              },
            ]}
          >
            <InputNumber
              min={-1}
              max={0}
              step={0.001}
              style={{
                margin: '0 16px',
                fontWeight: 'bold',
              }}
              placeholder="-0.51"
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-center py-6 border-t">
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
