import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from 'ui/components/common/PageTitle';
import { Form, Input } from 'antd';
import { capitalize, validateEmail } from 'utils/functions/common';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { showLog } from 'utils/functions/common';
import FirebaseAuth from 'services/firebase/authFirebase';
import { useDispatch, useSelector } from 'react-redux';
import { initSignUp } from 'store/slices/userSlice';
import { showSuccess } from 'utils/functions/common';
import { useNavigate } from 'react-router-dom';
import { routes } from 'navigation/routes';
import { notificationController } from 'controllers/notificationController';
import Load from 'ui/components/common/Load';
import logo from 'assets/logo/favicon-96x96.png';

const SignUp = ({ hasGoogleSignIn, hasFacebookSignIn, hasAppleSignIn }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, createUser } = FirebaseAuth();

  const { isSignUp } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);

  const signUpRef = useRef(false);
  const firstRef = useRef(true);
  const emailRef = useRef(null);

  useEffect(() => {
    dispatch(initSignUp());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSignUp && !signUpRef.current && !firstRef.current) {
      signUpRef.current = true;
      showSuccess({
        title: capitalize(t('สำเร็จ')),
        content: `${capitalize(
          t('ระบบได้ส่งลิงค์ยืนยัน ไปยังอีเมลของคุณ')
        )} ${capitalize(
          t(
            'กรุณายืนยันที่อยู่อีเมลในกล่องอีเมลของคุณ \n (อีเมลอาจอยู่ในกล่องจดหมายขยะ)'
          )
        )}`,
        onOk: () =>
          navigate(routes.LOGIN, {
            email: emailRef.current,
          }),
      });
    } else {
      firstRef.current = false;
    }
  }, [navigate, isSignUp, t]);

  const onSignUp = (values) => {
    showLog({ values });
    if (loading) {
      return;
    }
    const { email, password, confirmPassword } = values;
    const noPassword = !password || password === '';
    const noUserName = !email || email === '';
    if (noPassword || noUserName) {
      notificationController.error({
        message: `${capitalize(t('กรุณาป้อน'))} ${
          noUserName ? `${t('อีเมล').toLowerCase()},` : ''
        } ${noPassword ? t('รหัสผ่าน').toLowerCase() : ''}.`,
      });
      return;
    }
    if (password !== confirmPassword) {
      notificationController.error({
        message: `${capitalize(t('กรุณาตรวจสอบ'))} ${t(
          'ยืนยันรหัสผ่านไม่ตรงกัน'
        ).toLowerCase()}.`,
      });
      return;
    }
    let pass = password.replace(/(\r\n|\n|\r| )/g, '');
    pass = pass.trim();
    emailRef.current = email;
    createUser(email, pass, () => {});
    // createUser(email, pass, onClickLogin);
  };

  const onSignUpFailed = (values) => {
    showLog({ values });
  };
  const onEyeClick = () => setVisible((vs) => !vs);

  return (
    <>
      <PageTitle>{t('ลงทะเบียน')}</PageTitle>
      <div className="flex flex-col z-10 bg-slate-100 shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-2xl text-gray-800">
              {t('ลงทะเบียน')}
            </h3>
            <p className="text-gray-500">
              {t('กรุณาลงชื่อเพื่อสร้างบัญชีของคุณ')}
            </p>
          </div>
          <div>
            <img src={logo} alt="" />
          </div>
        </div>

        <div className="mt-4">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onSignUp}
            onFinishFailed={onSignUpFailed}
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
            <Form.Item
              name="confirmPassword"
              label={capitalize(t('ยืนยันรหัสผ่าน'))}
              rules={[
                { required: true, message: t('กรุณาป้อนข้อมูล') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    let password = getFieldValue('password');
                    // showLog({ password });
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (value === password) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t('ยืนยันรหัสผ่านไม่ตรงกัน'));
                  },
                }),
              ]}
              wrapperCol={{ sm: 24 }}
            >
              <Input
                id="confirmPassword"
                type={visible ? 'text' : 'password'}
                name="confirmPassword"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                placeholder={capitalize(t('ยืนยันรหัสผ่าน'))}
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
            <div className="flex w-full">
              <button
                type="submit"
                className={`w-full flex mt-4 justify-center items-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500`}
              >
                <span className="mr-2 uppercase text-lg">
                  {capitalize(t('ลงทะเบียน'))}
                </span>
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
              </button>
            </div>
          </Form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <span className="mr-2 text-slate-400 text-sm">
            {capitalize(t('มีบัญชีอยู่แล้ว?'))}
          </span>
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
        {(hasGoogleSignIn || hasFacebookSignIn) && (
          <div className="relative mt-10 h-px bg-gray-300">
            <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
              <span className="bg-background1 px-4 text-xs text-gray-500 uppercase">
                Or SignUp With
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

export default SignUp;
