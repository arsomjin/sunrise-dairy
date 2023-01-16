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
} from 'antd';
import UploadPhoto from 'ui/components/common/UploadPhoto';
import { useSelector } from 'react-redux';
import { showWarn } from 'utils/functions/common';
import { useTranslation } from 'react-i18next';
import { ROW_GUTTER } from 'constants/Styles';
import { getRules } from 'utils/functions/validator';
import Input from 'ui/elements/Input';
import { Provinces } from 'constants/thaiTambol';
import { getAmphoesFromProvince } from 'constants/thaiTambol';
import { getTambolsFromAmphoe } from 'constants/thaiTambol';
import { getPostcodeFromProvinceAndAmphoe } from 'constants/thaiTambol';
import { showLog } from 'utils/functions/common';
import { capitalize } from 'utils/functions/common';

const { Option } = Select;

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const residence1 = () => {
  let result = [];
  const provinces = Provinces().map((it) => ({ value: it.p, label: it.p }));
  provinces.map((pv) => {
    let child1 = [];
    const amphoes = getAmphoesFromProvince(pv.value).map((ap) => ap.a);
    amphoes.map((ap) => {
      let tb = getTambolsFromAmphoe(ap);
      const arr_pc = getPostcodeFromProvinceAndAmphoe(pv.value, ap);
      let pc = arr_pc.map((itp) => ({ value: itp.z, label: itp.z }));
      tb = tb.map((itm) => ({
        ...itm,
        children: pc,
      }));
      child1.push({ value: ap, label: ap, children: tb });
      return ap;
    });
    result.push({ ...pv, children: child1 });
    return pv;
  });
  return Promise.resolve(result);
};

const Profile = () => {
  const { USER, currentUser } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [residences2, setRes] = useState(null);

  useEffect(() => {
    const getResidences = async () => {
      let res = await residence1();
      setRes(res);
    };
    getResidences();
  }, []);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const _setPhotoUrl = async (photoURL) => {
    //  showLog('setPhotoURL', photoURL);
    try {
      // Update firestore.
      if (currentUser && currentUser.uid === USER.uid) {
        await currentUser.updateProfile({
          photoURL,
        });
      }
    } catch (e) {
      showWarn(e);
    }
  };

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

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  if (!residences2) {
    return null;
  }
  showLog({ residences2 });
  return (
    <div className="h-full bg-background1 p-4 overflow-y-auto">
      <h5 className="text-tw-black text-center">PROFILE</h5>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['นครราชสีมา', 'สูงเนิน', 'สูงเนิน', '30170'],
          prefix: 'นาย',
          phonePrefix: '86',
        }}
        scrollToFirstError
      >
        {(values) => {
          showLog({ values });
          return (
            <>
              <div className="flex text-center items-center p-4 py-8">
                <div className="flex">
                  <UploadPhoto
                    src={USER.photoURL}
                    storeRef={`images/users/${USER.uid}`}
                    setUrl={_setPhotoUrl}
                  />
                </div>
                <div className="ml-8 mt-2">
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
                </div>
              </div>
              <Row gutter={ROW_GUTTER}>
                <Col span={12}>
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
                <Col span={12}>
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
              </Row>
              <Form.Item
                name="residence"
                label={t('ที่อยู่')}
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
              <Row gutter={ROW_GUTTER}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
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
                <Col span={12}>
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
                      placeholder={`${t('ชาย')}, ${t('หญิง')}, ${t('อื่นๆ')}`}
                    >
                      <Option value="male">{t('ชาย')}</Option>
                      <Option value="female">{t('หญิง')}</Option>
                      <Option value="other">{t('อื่นๆ')}</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Should accept agreement')),
                  },
                ]}
                className="text-center"
              >
                <Checkbox>
                  {t('ฉันยอมรับ')} <a href="">{t('ข้อตกลงและเงื่อนไข')}</a>
                </Checkbox>
              </Form.Item>
              <Form.Item className="text-center">
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form>
    </div>
  );
};

export default Profile;
