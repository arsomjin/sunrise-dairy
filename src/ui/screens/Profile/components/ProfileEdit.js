import React, { useEffect, useState } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Input as AInput,
  Divider,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showWarn } from 'utils/functions/common';
import { useTranslation } from 'react-i18next';
import { ROW_GUTTER } from 'constants/Styles';
import { getRules } from 'utils/functions/validator';
import Input from 'ui/elements/Input';
import { capitalize } from 'utils/functions/common';
import { getResidences } from 'constants/thaiTambol';
import { cleanValuesBeforeSave, showConfirm } from 'utils/functions/common';
import { errorHandler } from 'utils/functions/common';
import { notificationController } from 'controllers/notificationController';
import { useLoading } from 'hooks/useLoading';
import { getFirestoreDoc } from 'services/firebase';
import { formatValuesBeforeLoad } from 'utils/functions/common';
import UploadAvatar from 'ui/components/common/UploadAvatar';
import { updateUserProfile } from 'services/API/app_api';
import { useResponsive } from 'hooks/useResponsive';
import { addSearchFields } from 'utils/functions/Searching';
import BarTitle from 'ui/components/common/BarTitle';

const { Option } = Select;

const ProfileEdit = ({ parent, notRequired, disabled, readOnly, setEdit }) => {
  const { USER } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const [residences2, setRes] = useState(null);

  const { mobileOnly } = useResponsive();

  useEffect(() => {
    const getAddresses = async () => {
      let res = await getResidences();
      setRes(res);
    };
    const getProfile = async () => {
      let doc = await getFirestoreDoc(`users/${USER?.uid}/info`, 'profile');
      if (doc) {
        let val = formatValuesBeforeLoad(doc);
        form.setFieldsValue(val);
      }
    };
    getAddresses();
    getProfile();
  }, [USER?.uid, form]);

  const preFinish = (values) => {
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: `${t('บันทึกข้อมูล')} ?`,
      onOk: () => onFinish(values),
    });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // console.log('Received values of form: ', values);
      // Add Search Fields
      const val = addSearchFields(values, [
        'firstName',
        'lastName',
        'phoneNumber',
      ]);

      const mValues = cleanValuesBeforeSave(val);
      await updateUserProfile(mValues, USER.uid);

      // await firebaseUpdateProfile({
      //   displayName: `${mValues?.firstName || ''} ${mValues?.lastName || ''}`,
      //   photoURL: mValues?.photoURL || '',
      // });
      setLoading(false);
      notificationController.success({
        message: `${capitalize(t('บันทึกข้อมูล'))} ${t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
      // form.resetFields();
    } catch (e) {
      showWarn(e);
      setLoading(false);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        snap: { ...cleanValuesBeforeSave(values), module: 'Profile' },
      });
    }
  };

  const [emailAutoCompleteResult, setEmailAutoCompleteResult] = useState([]);

  const onEmailChange = (value) => {
    if (!value) {
      setEmailAutoCompleteResult([]);
    } else {
      setEmailAutoCompleteResult(
        ['@gmail.com', '@hotmail.com', '.co.th'].map(
          (domain) => `${value}${domain}`
        )
      );
    }
  };

  const emailOptions = emailAutoCompleteResult.map((email) => ({
    label: email,
    value: email,
  }));

  const getParent = (field) =>
    parent ? [...parent, field] : ['address', field];

  if (!residences2) {
    return null;
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 80 }}
        options={[
          {
            value: 'นาย',
            label: t('นาย'),
          },
          {
            value: 'นาง',
            label: t('นาง'),
          },
          {
            value: 'นางสาว',
            label: t('นางสาว'),
          },
        ]}
      />
    </Form.Item>
  );

  return (
    <>
      <BarTitle>ข้อมูลส่วนตัว</BarTitle>
      <div className="h-full p-2 ">
        <Form
          form={form}
          name="register"
          onFinish={preFinish}
          initialValues={{
            residence: ['นครราชสีมา', 'สูงเนิน', 'สูงเนิน', '30170'],
            prefix: 'นาย',
            phonePrefix: '66',
            email: USER?.email,
            phoneNumber: USER?.phoneNumber
              ? `0${USER.phoneNumber.slice(-9)}`
              : undefined,
            url: USER?.photoURL || undefined,
          }}
          scrollToFirstError
        >
          {(values) => {
            // showLog({ values });
            return (
              <div className="py-2">
                <div className="flex flex-col items-center">
                  <p className="text-md text-primary mb-4">
                    {t('ข้อมูลส่วนตัว').toUpperCase()}
                  </p>
                  <Form.Item name="url">
                    <UploadAvatar
                      storeRef={`images/users/${USER.uid}/profile`}
                      title={t('รูปภาพ')}
                    />
                  </Form.Item>
                </div>
                <div className="pt-6 rounded-lg shadow-md bg-background2 px-2">
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
                        rules={[
                          {
                            required: true,
                            message: t('กรุณาป้อนข้อมูล'),
                            whitespace: true,
                          },
                        ]}
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
                          {
                            required: true,
                            message: t('กรุณาป้อนข้อมูล'),
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
                      <Form.Item
                        name="gender"
                        label={t('เพศ')}
                        rules={[
                          {
                            required: true,
                            message: `${t('กรุณาเลือก')}${t('เพศ')}`,
                          },
                        ]}
                      >
                        <Select
                          placeholder={`${t('ชาย')}, ${t('หญิง')}, ${t(
                            'อื่นๆ'
                          )}`}
                        >
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
                        rules={[
                          {
                            required: !notRequired,
                            message: 'กรุณาป้อนข้อมูล',
                          },
                        ]}
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
                        rules={[
                          {
                            required: !notRequired,
                            message: 'กรุณาป้อนข้อมูล',
                          },
                        ]}
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
                      <Form.Item
                        name={getParent('village')}
                        label={t('หมู่บ้าน')}
                      >
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
                      <Form.Item
                        name={getParent('building')}
                        label={t('อาคาร')}
                      >
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
                    label={`${t('จังหวัด')} / ${t('อำเภอ')} / ${t(
                      'ตำบล'
                    )} / ${t('รหัสไปรษณีย์')}`}
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
                <Divider />
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(new Error(t('กรุณายอมรับข้อตกลง'))),
                    },
                  ]}
                  className="text-center"
                >
                  <Checkbox>
                    {t('ฉันยอมรับ')} <a href="">{t('ข้อตกลงและเงื่อนไข')}</a>
                  </Checkbox>
                </Form.Item>
                <div className="flex items-center justify-center">
                  <Form.Item className="text-center">
                    <Button onClick={() => setEdit((pe) => !pe)}>
                      {t('ยกเลิก')}
                    </Button>
                  </Form.Item>
                  <div className="w-6" />
                  <Form.Item className="text-center">
                    <Button type="primary" htmlType="submit">
                      {t('บันทึก').toUpperCase()}
                    </Button>
                  </Form.Item>
                </div>
                <div className="h-36" />
              </div>
            );
          }}
        </Form>
      </div>
    </>
  );
};

export default ProfileEdit;
