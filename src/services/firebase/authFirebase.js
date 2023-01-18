import { useState } from 'react';
import { useDispatch } from 'react-redux';

import I18n from 'translations/i18n';
import {
  loginAccount,
  signUpAccount,
  resetAccount,
  logoutAccount,
  updateProfile,
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
  firebaseSignInWithPhoneNumber,
  firebaseSignInWithGoogle,
  updateFirestore,
  getFirestoreDoc,
  setFirestore,
} from '.';
import { GoogleAuthProvider } from 'firebase/auth';
import { cleanValuesBeforeSave } from 'utils/functions/common';
import { showLog } from 'utils/functions/common';
import { updateUserProfile } from 'services/API/app_api';

const FirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [final, setFinal] = useState();
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

  const loginUserWithPhone = async (phoneNumber, recapcha, callback) => {
    try {
      setLoading(true);
      let res = await firebaseSignInWithPhoneNumber(phoneNumber, recapcha);
      setFinal(res);
      callback(true);
      setLoading(false);
    } catch (err) {
      showWarn(err);
      setLoading(false);
      callback(false);
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            phoneNumber,
            module: 'loginUserWithPhone',
          },
        },
        'login'
      );
    }
  };

  const validateOtp = async (otp, callback) => {
    try {
      if (otp === null || final === null) return;
      setLoading(true);
      const res = await final.confirm(otp);
      dispatch(loginAccount({ res }));
      setLoading(false);
      notificationController.success({
        message: capitalize(I18n.t('เข้าสู่ระบบสำเร็จ')),
      });
    } catch (err) {
      // showWarn(err);
      setLoading(false);
      callback(err);
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
      callback(null);
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

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await firebaseSignInWithGoogle();
      if (res?.credential) {
        // Sign-in with Google, Facebook, Apple, etc.
        // credential: { providerId, signInMethod, accessToken}
        // user: { email, displayName, emailVerified, phoneNumber, photoURL }
        const { credential, user, token } = res;
        const {
          uid,
          email,
          displayName,
          emailVerified,
          phoneNumber,
          photoURL,
        } = user;
        const { providerId, signInMethod, accessToken } = credential;
        const profile = {
          uid,
          email,
          displayName,
          emailVerified,
          phoneNumber,
          photoURL,
          auth: { providerId, signInMethod, accessToken },
        };
        const mValues = cleanValuesBeforeSave(profile);
        await updateUserProfile(mValues, uid, dispatch);
      }
      dispatch(loginAccount({ res }));
      setLoading(false);
      notificationController.success({
        message: capitalize(I18n.t('เข้าสู่ระบบสำเร็จ')),
      });
    } catch (err) {
      showWarn(err);
      setLoading(false);
      // Handle Errors here.
      // The email of the user's account used.
      const email = err?.customData.email ? err.customData?.email : null;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(err);
      handleAuthErr(
        {
          code: err?.code || null,
          message: err?.message || null,
          snap: {
            module: 'signInWithGoogle',
            email,
            credential,
          },
        },
        'login'
      );
    }
  };

  const handleAuthErr = async (err, type) => {
    const handleOk = () => navigate(routes.SIGNUP);
    try {
      showWarn(err);
      let msg = await getAuthErrorMessage(err);
      let trMsg = I18n.t(msg);
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
            content: <span>{capitalize(trMsg)}</span>,
            onOk: () => navigate(routes.SIGNUP),
            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
            okText: I18n.t('สร้างบัญชีใหม่'),
          });
          break;
        case 'auth/email-already-in-use':
          showWarning({
            title,
            content: (
              <span>{`${capitalize(trMsg)} ${I18n.t(
                'กรุณาเข้าสู่ระบบ'
              )}`}</span>
            ),
            onOk: () => navigate(routes.LOGIN),
            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600' },
          });
          break;

        default:
          notificationController.error({
            message: `${title}. ${capitalize(trMsg)}.`,
          });
          break;
      }
      Firebase.addErrorLogs(Object.assign(err, { msg, trMsg }));
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
    loginUserWithPhone,
    validateOtp,
    signInWithGoogle,
  };
};

export default FirebaseAuth;
