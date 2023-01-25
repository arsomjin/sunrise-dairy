import { CheckOutlined } from '@ant-design/icons';
import { Row, Col, Form, AutoComplete, Select, Cascader, Divider } from 'antd';
import { ROW_GUTTER } from 'constants/Styles';
import UploadAvatar from 'ui/components/common/UploadAvatar';
import Button from 'ui/elements/Button';
import Input from 'ui/elements/Input';
import { capitalize } from 'utils/functions/common';
import { getRules } from 'utils/functions/validator';

const { Option } = Select;

export const renderMembersBody = ({
  mobileOnly,
  prefixSelector,
  t,
  onClear,
  onDelete,
  isModal,
  memberId,
  disabled,
  readOnly,
  emailOptions,
  getParent,
  onEmailChange,
  notRequired,
  residences2,
}) => (
  <div className="py-2" style={{ maxHeight: '80vh' }}>
    <div
      className="rounded-lg bg-background2 overflow-y-scroll"
      style={{ maxHeight: '70vh' }}
    >
      <div className="flex flex-col items-center">
        <p className="text-md text-primary mb-4">{t('รูปภาพ').toUpperCase()}</p>
        <Form.Item name="url">
          <UploadAvatar
            storeRef={`images/members/${memberId}/profile`}
            title={t('รูปภาพ')}
          />
        </Form.Item>
      </div>
      <div className="pt-6 rounded-lg shadow-md bg-background2 px-2">
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item name="memberNo" label={t('รหัสสมาชิก')}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item
              name="bucketNo"
              label={t('เบอร์ถัง')}
              rules={[
                {
                  required: true,
                  message: t('กรุณาป้อนข้อมูล'),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? 24 : 12}>
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
              <Input addonBefore={prefixSelector} />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 24 : 12}>
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
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item
              name="nickName"
              label={t('ชื่อเล่น')}
              tooltip={t('อยากให้คนเรียกชื่อคุณว่าอะไร?')}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item
              name="email"
              label={t('อีเมล')}
              rules={[
                {
                  type: 'email',
                  message: t('รูปแบบอีเมลไม่ถูกต้อง'),
                },
              ]}
            >
              <AutoComplete
                options={emailOptions}
                onChange={onEmailChange}
                placeholder="name@mail.com"
              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item
              name="phoneNumber"
              label={capitalize(t('เบอร์โทรศัพท์'))}
              rules={getRules(['required', 'mobileNumber'])}
            >
              <Input
                addonBefore="+66"
                mask="000-0000000"
                placeholder="082-3456789"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 24 : 12}>
            <Form.Item name="gender" label={t('เพศ')}>
              <Select placeholder={`${t('ชาย')}, ${t('หญิง')}, ${t('อื่นๆ')}`}>
                <Option value="male">{t('ชาย')}</Option>
                <Option value="female">{t('หญิง')}</Option>
                <Option value="other">{t('อื่นๆ')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div className="py-3 rounded-lg shadow-md bg-background2 px-3 mt-4">
        <label className="text-tw-muted m-2">{t('ที่อยู่')}</label>
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? '12' : '6'}>
            <Form.Item
              name={getParent('h_number')}
              label={t('บ้านเลขที่')}
              rules={[{ required: !notRequired, message: 'กรุณาป้อนข้อมูล' }]}
            >
              <Input
                placeholder={t('บ้านเลขที่')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? '12' : '6'}>
            <Form.Item
              name={getParent('moo')}
              label={t('หมู่ที่')}
              rules={[{ required: !notRequired, message: 'กรุณาป้อนข้อมูล' }]}
            >
              <Input
                placeholder={t('หมู่ที่')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? '24' : '12'}>
            <Form.Item name={getParent('village')} label={t('หมู่บ้าน')}>
              <Input
                placeholder={t('หมู่บ้าน')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={ROW_GUTTER}>
          <Col span={mobileOnly ? 12 : '7'}>
            <Form.Item name={getParent('soi')} label={t('ซอย')}>
              <Input
                placeholder={t('ซอย')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 12 : '7'}>
            <Form.Item name={getParent('road')} label={t('ถนน')}>
              <Input
                placeholder={t('ถนน')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 12 : '7'}>
            <Form.Item name={getParent('building')} label={t('อาคาร')}>
              <Input
                placeholder={t('อาคาร')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={mobileOnly ? 12 : '3'}>
            <Form.Item name={getParent('floor')} label={t('ชั้น')}>
              <Input
                placeholder={t('ชั้น')}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="residence"
          label={`${t('จังหวัด')} / ${t('อำเภอ')} / ${t('ตำบล')} / ${t(
            'รหัสไปรษณีย์'
          )}`}
          rules={[
            {
              type: 'array',
              required: true,
              message: t('กรุณาป้อนข้อมูล'),
            },
          ]}
        >
          <Cascader options={residences2} />
        </Form.Item>
      </div>
    </div>
    <Divider />
    <div className="flex justify-center items-center">
      <Button style={{ marginRight: 20 }} onClick={onClear}>
        {t('ล้างข้อมูล').toUpperCase()}
      </Button>
      <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
        {t('บันทึก').toUpperCase()}
      </Button>
    </div>
    <div className="h-36" />
  </div>
);
