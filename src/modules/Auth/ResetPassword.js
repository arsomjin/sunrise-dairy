import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BarTitle from 'ui/components/common/BarTitle';
import { Button, Form, Input, Typography } from 'antd';
import { capitalize, validateEmail } from 'utils/functions/common';
import {
  CheckCircleOutlined,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { showLog } from 'utils/functions/common';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import FirebaseAuth from 'services/firebase/authFirebase';
import { initResetAccount } from 'store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { routes } from 'navigation/routes';
import { showSuccess } from 'utils/functions/common';
import Load from 'ui/components/common/Load';
import { showConfirm } from 'utils/functions/common';
import logo from 'assets/logo-new/roongaroon-dairy.png';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { loading, resetPassword } = FirebaseAuth();
  const navigate = useNavigate();
  const { passwordReset } = useSelector((state) => state.user);
  const [email, setEmail] = useState(null);

  const dispatch = useDispatch();
  const resetRef = useRef(false);
  const firstResetRef = useRef(true);

  useEffect(() => {
    dispatch(initResetAccount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // showLog('RESET_PASSWORD_EFFECT');
    if (passwordReset && !resetRef.current && !firstResetRef.current && email) {
      resetRef.current = true;
      showSuccess({
        title: capitalize(t('สำเร็จ')),
        content: (
          <div className="flex flex-col">
            <span>{`${t(
              'กรุณารีเซ็ตรหัสผ่าน ในลิงค์ที่ส่งไปยังอีเมลของคุณ'
            )} [ ${email} ] ${capitalize(
              t('และเข้าสู่ระบบโดยใช้รหัสผ่านใหม่')
            )}`}</span>
            <Button
              className="mt-6"
              key="link"
              href={routes.LOGIN}
              type="primary"
            >
              {t('ตกลง')}
            </Button>
          </div>
        ),
        footer: false,
      });
    } else {
      firstResetRef.current = false;
    }
  }, [email, navigate, passwordReset, t]);

  const pre_reset = (values) => {
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: `${t('รีเซ็ตรหัสผ่าน')} ${values?.email} ?`,
      onOk: () => onResetPassword(values),
      okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
    });
  };

  const onResetPassword = (values) => {
    if (loading) {
      return;
    }
    resetPassword(values.email, () => {});
    setEmail(values.email);
  };

  const onResetPasswordFailed = (values) => {
    showLog({ onResetPasswordFailed: values });
  };

  return (
    <>
      <BarTitle>{t('รีเซ็ตรหัสผ่าน')}</BarTitle>
      <div className="flex flex-col z-10 bg-slate-100 shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-full max-w-md">
        <div className="mb-4">
          <h3 className="font-semibold text-2xl text-gray-800">
            {t('รีเซ็ตรหัสผ่าน')}
          </h3>
          <div className="mt-2">
            <span className="text-sm text-slate-500">
              {`${t(
                'ระบบจะส่งลิงค์ชั่วคราวสำหรับเปลี่ยนรหัสผ่าน ไปยังอีเมลของคุณ'
              )} \n (${t('อีเมลอาจอยู่ในกล่องจดหมายขยะ')})`}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={pre_reset}
            onFinishFailed={debounce(onResetPasswordFailed, 100)}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label={capitalize(t('อีเมล'))}
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
              wrapperCol={{ sm: 24 }}
            >
              <Input
                id="email"
                type="email"
                name="email"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                placeholder="name@mail.com"
                prefix={<UserOutlined className="text-slate-500" />}
                // prefix={<span className="text-lg text-slate-400">@</span>}
                size="large"
              />
            </Form.Item>
            <div className="flex w-full">
              <button
                type="submit"
                className={`w-full flex mt-4 justify-center items-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500`}
              >
                <span className="mr-2 uppercase text-lg">
                  {capitalize(t('ยืนยัน'))}
                </span>
                <span>
                  <CheckCircleOutlined className="text-base" />
                </span>
              </button>
            </div>
          </Form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <a
            href="/auth/login"
            // target="_blank"
            className={`inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center`}
          >
            <span>
              <LoginOutlined className="text-base" />
            </span>
            <span className="ml-2 text-sm">{capitalize(t('เข้าสู่ระบบ'))}</span>
          </a>
        </div>
      </div>
      <Load loading={loading} />
    </>
  );
};

export default ResetPassword;
