import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Select } from 'antd';
import classNames from 'classnames';
import { ROW_GUTTER } from 'constants/Styles';
import EmployeeSelector from 'ui/components/EmployeeSelector';
import MemberSelector from 'ui/components/MemberSelector';
import Button from 'ui/elements/Button';
import Switch from 'ui/elements/Switch';
import { showConfirm } from 'utils/functions/common';

export const renderUsersBody = ({ t, onCancel, isModal, values, form }) => (
  <div className="py-2" style={{ maxHeight: '80vh' }}>
    <div
      className="rounded-lg bg-background2 overflow-y-scroll"
      style={{ maxHeight: '70vh' }}
    >
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-3 border-b mb-3">
          <div className="flex flex-col items-center">
            <span
              className={classNames(
                'text-lg font-bold mb-2',
                values?.granted ? 'text-secondary' : 'text-danger'
              )}
            >
              ** สิทธิ์การเข้าใช้งานระบบ **
            </span>
            <Form.Item name="granted">
              <Switch
                style={{
                  backgroundColor: values?.granted ? '#17c671' : '#c4183c',
                }}
              />
            </Form.Item>
          </div>
          <Row gutter={ROW_GUTTER}>
            <Col
              span={24}
              sm={['member', 'employee'].includes(values.role) ? 12 : 24}
            >
              <div className="flex flex-col items-center">
                <span
                  className={classNames(
                    'text-lg font-bold mb-2',
                    values?.granted ? 'text-secondary' : 'text-danger'
                  )}
                >
                  ** สมาชิก / พนักงาน **
                </span>
                <Form.Item name="role">
                  <Select
                    style={{
                      width: 160,
                      textAlign: 'center',
                    }}
                    options={[
                      {
                        value: 'employee',
                        label: 'พนักงาน',
                      },
                      {
                        value: 'member',
                        label: 'สมาชิก',
                      },
                      {
                        value: 'undefined',
                        label: 'ไม่ระบุ',
                      },
                    ]}
                  />
                </Form.Item>
              </div>
            </Col>
            {['member', 'employee'].includes(values.role) && (
              <Col span={24} sm={12}>
                <div className="flex flex-col items-center">
                  <span
                    className={classNames(
                      'text-lg font-bold mb-2',
                      values?.granted ? 'text-secondary' : 'text-danger'
                    )}
                  >
                    {values.role === 'member'
                      ? 'ระบุชื่อสมาชิก'
                      : 'ระบุชื่อพนักงาน'}
                  </span>
                  <Form.Item
                    // rules={[
                    //   {
                    //     required: ['member', 'employee'].includes(values.role),
                    //     message: t('กรุณาป้อนข้อมูล'),
                    //   },
                    // ]}
                    name={values.role === 'member' ? 'memberId' : 'employeeId'}
                  >
                    {values.role === 'member' ? (
                      <MemberSelector
                        style={{
                          width: 240,
                        }}
                      />
                    ) : (
                      <EmployeeSelector
                        style={{
                          width: 240,
                        }}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col>
            )}
          </Row>
          <span className="text-primary">ราคาน้ำนมดิบ</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item name={['milk', 'price', 'view']} label="สิทธิ์การอ่าน">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['milk', 'price', 'edit']}
                label="สิทธิ์การแก้ไข"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="p-3 border-b mb-3">
          <span className="text-primary">ข้อมูลคุณภาพน้ำนมดิบ</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item name={['milk', 'QC', 'view']} label="สิทธิ์การอ่าน">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['milk', 'QC', 'edit']} label="สิทธิ์การแก้ไข">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['milk', 'QC', 'add']} label="บันทึกข้อมูล">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* <div className="p-3 border-b mb-3">
          <span className="text-primary">รายงานคุณภาพน้ำนมดิบ</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item name={['milk', 'QC', 'view']} label="สิทธิ์การอ่าน">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div> */}
      </div>
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-3 border-b mb-3">
          <span className="text-primary">รายชื่อผู้ใช้งาน</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item
                name={['personal', 'user', 'view']}
                label="สิทธิ์การอ่าน"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['personal', 'user', 'edit']}
                label="สิทธิ์การแก้ไข"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="p-3 border-b mb-3">
          <span className="text-primary">รายชื่อสมาชิก</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item
                name={['personal', 'member', 'view']}
                label="สิทธิ์การอ่าน"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['personal', 'member', 'edit']}
                label="สิทธิ์การแก้ไข"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['personal', 'member', 'add']}
                label="บันทึกข้อมูล"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="p-3 border-b mb-3">
          <span className="text-primary">รายชื่อพนักงาน</span>
          <Row gutter={ROW_GUTTER}>
            <Col span={8}>
              <Form.Item
                name={['personal', 'employee', 'view']}
                label="สิทธิ์การอ่าน"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['personal', 'employee', 'edit']}
                label="สิทธิ์การแก้ไข"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['personal', 'employee', 'add']}
                label="บันทึกข้อมูล"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div className="flex justify-center py-4 border-t shadow-lg">
      <Button style={{ marginRight: 20 }} onClick={onCancel}>
        {t('ยกเลิก').toUpperCase()}
      </Button>
      <Button
        type="primary"
        htmlType="submit"
        icon={isModal ? <CheckOutlined /> : <PlusOutlined />}
      >
        {t('บันทึก').toUpperCase()}
      </Button>
    </div>
    <div className="h-36" />
  </div>
);
