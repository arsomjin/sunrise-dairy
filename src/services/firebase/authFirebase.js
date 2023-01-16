import { useState } from 'react';
import { useDispatch } from 'react-redux';

import I18n from 'translations/i18n';
import {
  loginAccount,
  signUpAccount,
  resetAccount,
  logoutAccount,
} from '../../store/slices/userSlice';
import { routes } from '../../navigation/routes';
import { notificationController } from 'controllers/notificationController';
import { useNavigate } from 'react-router-dom';
import { capitalize, showWarn } from 'utils/functions/common';
import { getAuthErrorMessage } from 'modules/Auth/api';
import Firebase from './api';
import { showWarning } from 'utils/functions/common';
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseResetPassword,
  firebaseSignOut,
} from '.';
import { Button, Modal } from 'antd';

const FirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      let res = await firebaseSignIn(email, password);
      dispatch(loginAccount({ res }));
      setLoading(false);
      notificationController.success({
        message: capitalize(I18n.t('เข้าสู่ระบบสำเร็จ')),
      });
    } catch (err) {
      showWarn(err);
      setLoading(false);
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            email,
            password,
            module: 'loginUser',
          },
        },
        'login'
      );
    }
  };

  const createUser = async (email, password, callback) => {
    try {
      setLoading(true);
      const res = await firebaseSignUp(email, password);
      dispatch(signUpAccount(res));
      setLoading(false);
      notificationController.success({
        message: capitalize(I18n.t('ลงทะเบียนสำเร็จ')),
      });
      callback(res);
    } catch (err) {
      showWarn(err);
      setLoading(false);
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            email,
            password,
            module: 'createUser',
          },
        },
        'signUp'
      );
    }
  };

  const resetPassword = async (email, callback) => {
    try {
      setLoading(true);
      const res = await firebaseResetPassword(email);
      dispatch(resetAccount(res));
      setLoading(false);
      notificationController.success({
        message: `${capitalize(I18n.t('รีเซ็ตรหัสผ่าน'))} ${I18n.t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
      callback();
    } catch (err) {
      showWarn(err);
      setLoading(false);
      handleAuthErr(err, 'reset');
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            email,
            module: 'resetPassword',
          },
        },
        'reset'
      );
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      const res = await firebaseSignOut();
      dispatch(logoutAccount());
      setLoading(false);
      notificationController.success({
        message: `${capitalize(I18n.t('ออกจากระบบ'))} ${I18n.t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
    } catch (err) {
      showWarn(err);
      setLoading(false);
      handleAuthErr(err, 'signOut');
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            module: 'signOutUser',
          },
        },
        'signOut'
      );
    }
  };

  const handleAuthErr = async (err, type) => {
    const handleOk = () => navigate(routes.SIGNUP);
    try {
      showWarn(err);
      let msg = await getAuthErrorMessage(err);
      let title = capitalize(I18n.t('เข้าสู่ระบบไม่สำเร็จ'));
      switch (type) {
        case 'signUp':
          title = capitalize(I18n.t('ลงทะเบียนไม่สำเร็จ'));
          break;
        case 'reset':
          title = `${capitalize(I18n.t('ส่งอีเมลสำเร็จ'))} ${I18n.t(
            'ไม่สำเร็จ'
          ).toLowerCase()}.`;
          break;
        case 'signOut':
          title = `${capitalize(I18n.t('ออกจากระบบ'))} ${I18n.t(
            'ไม่สำเร็จ'
          ).toLowerCase()}.`;
          break;
        case 'verification':
          title = `${capitalize(I18n.t('ส่งอีเมลไม่สำเร็จ')).toLowerCase()}.`;
          break;

        default:
          break;
      }
      switch (err.code) {
        case 'auth/user-not-found':
          showWarning({
            title,
            content: <span>{capitalize(msg)}</span>,
            onOk: () => navigate(routes.SIGNUP),
            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
            okText: I18n.t('สร้างบัญชีใหม่'),
          });
          break;
        case 'auth/email-already-in-use':
          showWarning({
            title,
            content: (
              <span>{`${capitalize(msg)} ${I18n.t('กรุณาเข้าสู่ระบบ')}`}</span>
            ),
            onOk: () => navigate(routes.LOGIN),
            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
          });
          break;

        default:
          notificationController.error({
            message: `${title}. ${capitalize(msg)}.`,
          });
          break;
      }
      Firebase.addErrorLogs(Object.assign(err, { msg }));
    } catch (e) {
      showWarn(e);
    }
  };

  return {
    loading,
    createUser,
    loginUser,
    resetPassword,
    handleAuthErr,
    signOutUser,
  };
};

export default FirebaseAuth;
