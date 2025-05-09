import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BarTitle from 'ui/components/common/BarTitle';
import { Form, Input } from 'antd';
import { capitalize } from 'utils/functions/common';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import FirebaseAuth from 'services/firebase/authFirebase';
import { useNavigate } from 'react-router-dom';
import { routes } from 'navigation/routes';
import Firebase from 'services/firebase/api';
import { showWarn } from 'utils/functions/common';
import Load from 'ui/components/common/Load';
import logo from 'assets/logo-new/roongaroon-dairy.jpg';

const Login = ({ hasGoogleSignIn, hasFacebookSignIn, hasAppleSignIn }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const { loading, loginUser } = FirebaseAuth();
  const navigate = useNavigate();

  const firstRef = useRef(true);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;

      const _checkVerified = async () => {
        try {
          if (loading) {
            return;
          }
          let verified = await Firebase.checkVerified();
          if (verified?.verified === false) {
            navigate(routes.VERIFICATION, {
              email: verified.user?.email,
            });
          }
        } catch (e) {
          showWarn(e);
        }
      };
      _checkVerified();
    }
  }, [loading, navigate]);

  const onLogin = async (values) => {
    try {
      if (loading) {
        return;
      }
      const { email, password } = values;
      loginUser(email, password);
    } catch (e) {
      showWarn(e);
    }
  };

  const onLoginFailed = (values) => {
    showWarn({ values });
  };
  const onEyeClick = () => setVisible((vs) => !vs);
  return (
    <>
      <BarTitle>{t('เข้าสู่ระบบ')}</BarTitle>
      <div className="flex flex-col z-10 bg-slate-100 shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-2xl text-gray-800">
              {t('เข้าสู่ระบบ')}
            </h3>
            <p className="text-gray-500">
              {t('กรุณาลงชื่อเข้าใช้บัญชีของคุณ')}
            </p>
          </div>
          <div className="auth-form-logo-wrapper">
            <img src={logo} alt="" className="auth-form-logo" />
          </div>
        </div>
        <div className="mt-4">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onLogin}
            onFinishFailed={onLoginFailed}
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
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={capitalize(t('รหัสผ่าน'))}
              rules={[
                { required: true, message: t('กรุณาป้อนข้อมูล') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    let tVal = value.trim();
                    if (tVal.length >= 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      t(
                        'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร และประกอบด้วยอักษรหรือตัวเลข'
                      )
                    );
                  },
                }),
              ]}
              wrapperCol={{ sm: 24 }}
            >
              <Input
                id="password"
                type={visible ? 'text' : 'password'}
                name="password"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                placeholder={capitalize(t('รหัสผ่าน'))}
                prefix={<LockOutlined className="text-slate-500" />}
                suffix={
                  visible ? (
                    <EyeOutlined
                      onClick={onEyeClick}
                      className="text-slate-500"
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      onClick={onEyeClick}
                      className="text-slate-500"
                    />
                  )
                }
                size="large"
              />
            </Form.Item>
            <div className="flex items-center mb-6 -mt-4">
              <div className="flex ml-auto">
                <a
                  href="/auth/reset-password"
                  className={`text-blue-400 hover:text-blue-500`}
                >
                  {`${capitalize(t('ลืมรหัสผ่าน'))} ?`}
                </a>
              </div>
            </div>
            <div className="flex w-full ">
              <button
                type="submit"
                className={`w-full flex justify-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500`}
              >
                <span className="mr-2 uppercase text-lg">
                  {capitalize(t('เข้าสู่ระบบ'))}
                </span>
                <span>
                  <svg
                    className="h-6 w-6 mt-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </Form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <span className="mr-2 text-slate-400 text-sm">
            {`${capitalize(t('ยังไม่มีบัญชี'))} ?`}
          </span>
          <a
            href="/auth/signup"
            // target="_blank"
            className={`inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center`}
          >
            <span>
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <span className="ml-2 text-sm">{capitalize(t('ลงทะเบียน'))}</span>
          </a>
        </div>
        {(hasGoogleSignIn || hasFacebookSignIn) && (
          <div className="relative mt-10 h-px bg-gray-300">
            <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
              <span className="bg-background1 px-4 text-xs text-gray-500 uppercase">
                Or Login With
              </span>
            </div>
          </div>
        )}
        {hasGoogleSignIn && (
          <button className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
            <span
              className={`absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500`}
            >
              <i className="fab fa-google"></i>
            </span>
            <span>{t('เข้าสู่ระบบด้วย')} Google</span>
          </button>
        )}
        {hasAppleSignIn && (
          <button className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
            <span
              className={`absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500`}
            >
              <i className="fab fa-apple"></i>
            </span>
            <span>{t('เข้าสู่ระบบด้วย')} Apple</span>
          </button>
        )}
        {hasFacebookSignIn && (
          <button className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
            <span
              className={`absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500`}
            >
              <i className="fab fa-facebook-f"></i>
            </span>
            <span>{t('เข้าสู่ระบบด้วย')} Facebook</span>
          </button>
        )}
      </div>
      <Load loading={loading} />
    </>
  );
};

export default Login;
