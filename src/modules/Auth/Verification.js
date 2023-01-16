import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from 'ui/components/common/PageTitle';
import { Button } from 'antd';
import { capitalize } from 'utils/functions/common';
import {
  AuditOutlined,
  CheckCircleOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import CountdownTimer from 'ui/components/common/CountdownTimer';
import Firebase from 'services/firebase/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'navigation/routes';
import FirebaseAuth from 'services/firebase/authFirebase';
import { useLoading } from 'hooks/useLoading';
import {
  showLog,
  showWarn,
  waitFor,
  showError,
  showSuccess,
  showConfirm,
} from 'utils/functions/common';
import { sendVerifyEmail, firebaseSignOut } from 'services/firebase';
import { currentUser } from 'services/firebase';
import Load from 'ui/components/common/Load';
import logo from 'assets/logo/favicon-96x96.png';

const SEND_PERIOD = 300;

const Verification = ({ email }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const params = location.state?.params;
  showLog({ params, email });
  const [loading, setLoading] = useLoading();
  const [sended, setSend] = useState(false);

  const { t } = useTranslation();

  const handleVerify = async (values) => {
    try {
      setLoading(true);
      let verified = await Firebase.checkVerified();
      showLog({ verified });
      setLoading(false);
      if (verified?.verified === false) {
        showError({
          title: capitalize(t('ไม่สำเร็จ')),
          content: `${verified.user?.email}\n${capitalize(
            t(
              'กรุณายืนยันที่อยู่อีเมลในกล่องอีเมลของคุณ \n (อีเมลอาจอยู่ในกล่องจดหมายขยะ)'
            )
          )}`,
        });
      } else {
        showSuccess({
          title: capitalize(t('สำเร็จ')),
          content: capitalize(t('กรุณาเข้าสู่ระบบ')),
          onOk: () => navigate(routes.LOGIN),
        });
      }
    } catch (e) {
      setLoading(false);
      showWarn(e);
    }
  };

  const pre_re_sendEmail = async () => {
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: `${t('ส่งอีเมลยืนยันอีกครั้ง')} ?`,
      onOk: _sendVerification,
    });
  };

  const _sendVerification = async () => {
    try {
      setLoading(true);
      await sendVerifyEmail();
      let mUser = Firebase.getFirebaseUserFromObject(currentUser());
      showLog({ mUser });
      setLoading(false);
      setSend(true);
      showSuccess({
        title: t('สำเร็จ').toUpperCase(),
        content: `${capitalize(
          t('ระบบได้ส่งลิงค์ยืนยัน ไปยังอีเมลของคุณ')
        )}\n[ ${mUser?.email} ]`,
      });
    } catch (e) {
      showWarn(e);
      FirebaseAuth.handleAuthErr(e, 'verification');
      setLoading(false);
    }
  };

  const _onTimerEnd = async () => {
    await waitFor(500);
    setSend(false);
  };

  const pre_re_siginup = async () => {
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: `${t('ลงทะเบียนด้วยอีเมลอื่น')} ?`,
      onOk: () => re_siginup(),
    });
  };

  const re_siginup = async () => {
    try {
      setLoading(true);
      await firebaseSignOut();
      setLoading(false);
      navigate(routes.SIGNUP);
    } catch (e) {
      showWarn(e);
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle>{t('กรุณายืนยันที่อยู่อีเมล')}</PageTitle>
      <div className="flex flex-col z-10 bg-slate-100 shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-2xl text-gray-800">
              {t('กรุณายืนยันที่อยู่อีเมล')}
            </h3>
            <p className="text-gray-500">
              {t('ระบบได้ส่งลิงค์ยืนยัน ไปยังอีเมลของคุณ')}
            </p>
          </div>
          <div>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex w-full">
            <button
              onClick={handleVerify}
              className={`w-full flex mt-4 justify-center items-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500`}
            >
              <span className="mr-2 text-lg uppercase">
                {capitalize(t('ยืนยันแล้ว'))}
              </span>
              <span>
                <CheckCircleOutlined className="text-base" />
              </span>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          {sended ? (
            <CountdownTimer
              seconds={SEND_PERIOD}
              startWhenMounted
              noButtons
              onFinish={() => _onTimerEnd()}
            />
          ) : (
            <Button
              type="ghost"
              title={`${t('ส่งอีเมลยืนยันอีกครั้ง')}`}
              onClick={() => pre_re_sendEmail()}
              icon={<AuditOutlined />}
              className={`flex items-center justify-center text-blue-500`}
            >{`${t('ส่งอีเมลยืนยันอีกครั้ง')}`}</Button>
          )}
        </div>
        <div className="flex justify-center items-center mt-6">
          <a
            onClick={pre_re_siginup}
            className={`inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center`}
          >
            <span>
              <LoginOutlined className="text-base" />
            </span>
            <span className="ml-2 text-sm">
              {capitalize(t('ลงทะเบียนด้วยอีเมลอื่น'))}
            </span>
          </a>
        </div>
      </div>
      <Load loading={loading} />
    </>
  );
};

export default Verification;
