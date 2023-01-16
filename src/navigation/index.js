import React, { useEffect, useRef } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { useDispatch, useSelector } from 'react-redux';
import thTH from 'antd/lib/locale/th_TH';
import enUS from 'antd/lib/locale/en_US';
import { updateLan } from 'store/slices/appSlice';
import { useTranslation } from 'react-i18next';
import { AppRouter } from './router/AppRouter';
import { LoadingProvider } from 'hooks/useLoading';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { getCurrentUser } from 'store/slices/userSlice';
import { resetUserStates } from 'store/slices/userSlice';
import { HelmetProvider } from 'react-helmet-async';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Firebase from 'services/firebase/api';

const Navigation = () => {
  const { lan, nightMode } = useSelector((state) => state.global);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentFirebaseUser = useCurrentUser();

  const firstMounted = useRef(true);

  useEffect(() => {
    let currentUser = !!currentFirebaseUser
      ? Firebase.getFirebaseUserFromObject(currentFirebaseUser)
      : currentFirebaseUser;
    if (!firstMounted.current) {
      // Avoid flickering to auth page.
      firstMounted.current = false;
      dispatch(getCurrentUser({ currentUser }));
    }
  }, [currentFirebaseUser, dispatch]);

  useEffect(() => {
    // dispatch(resetUserStates());
    i18n.changeLanguage(typeof lan === 'undefined' ? i18n.language : lan);
    dispatch(
      updateLan({ lan: typeof lan === 'undefined' ? i18n.language : lan })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProSidebarProvider>
      <ConfigProvider
        locale={lan === 'en' ? enUS : thTH}
        theme={{
          algorithm: nightMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <StyleProvider hashPriority="high">
          <div className="bg-background1">
            <HelmetProvider>
              <LoadingProvider>
                <AppRouter />
              </LoadingProvider>
            </HelmetProvider>
          </div>
        </StyleProvider>
      </ConfigProvider>
    </ProSidebarProvider>
  );
};

// StyleProvider to fix antd-design conflict with tailwindcss.

export default Navigation;
