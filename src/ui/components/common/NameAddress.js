import React from 'react';
import { Form } from 'antd';
import { Input } from 'ui/elements/Input';
import PrefixAnt from './PrefixAnt';
import { Fragment } from 'react';
import { Row, Col } from 'shards-react';
import { getRules } from 'api/Table';

export const Name = ({
  values,
  disabled,
  readOnly,
  phoneNumberRequired,
  nameValue,
}) => {
  return (
    <Fragment>
      <Row noGutters>
        <Col md="2">
          <Form.Item
            name={!!nameValue ? [nameValue, 'prefix'] : 'prefix'}
            label="คำนำหน้า"
            rules={getRules(['required'])}
          >
            <PrefixAnt
              disabled={disabled || readOnly}
              readOnly={readOnly}
              placeholder="คำนำหน้า"
            />
          </Form.Item>
        </Col>
        <Col md="3">
          <Form.Item
            name={!!nameValue ? [nameValue, 'firstName'] : 'firstName'}
            label="ชื่อ"
            rules={getRules(['required'])}
          >
            <Input
              placeholder="กรุณาป้อนชื่อ"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
        {/* นามสกุล */}
        {!['หจก.', 'บจก.', 'บมจ.', 'ร้าน'].includes(
          !!nameValue ? values[nameValue]?.prefix : values.prefix
        ) && (
          <Col md="4">
            <Form.Item
              name={!!nameValue ? [nameValue, 'lastName'] : 'lastName'}
              label="นามสกุล"
            >
              <Input
                placeholder="นามสกุล"
                disabled={disabled}
                readOnly={readOnly}
              />
            </Form.Item>
          </Col>
        )}
        <Col md="3">
          <Form.Item
            name={!!nameValue ? [nameValue, 'phoneNumber'] : 'phoneNumber'}
            label="เบอร์โทร"
            rules={getRules(
              phoneNumberRequired
                ? ['required', 'mobileNumber']
                : ['mobileNumber']
            )}
          >
            <Input
              disabled={disabled}
              readOnly={readOnly}
              mask="000-0000000"
              placeholder="082-3456789"
            />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};
export const Address = ({
  parent,
  disabled,
  label,
  noLabel,
  readOnly,
  notRequired,
}) => {
  const getParent = (field) =>
    parent ? [...parent, field] : ['address', field];
  return (
    <Fragment>
      {!noLabel && (
        <label className="text-light mb-2">{label || 'ที่อยู่'}</label>
      )}
      <Row noGutters>
        <Col md="3">
          <Form.Item
            name={getParent('address')}
            label="บ้านเลขที่"
            rules={[{ required: !notRequired, message: 'กรุณาป้อนข้อมูล' }]}
          >
            <Input
              placeholder="บ้านเลขที่"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
        <Col md="3">
          <Form.Item name={getParent('moo')} label="หมู่ที่">
            <Input
              placeholder="หมู่ที่"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
        <Col md="3">
          <Form.Item name={getParent('village')} label="หมู่บ้าน">
            <Input
              placeholder="หมู่บ้าน"
              disabled={disabled}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};
