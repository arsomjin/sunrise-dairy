import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { withLoading } from 'hocs/withLoading.hoc';
import Login from 'modules/Auth/Login';
import SignUp from 'modules/Auth/SignUp';
import loginBackground from 'assets/images/dairy-farm.webp';
import ResetPassword from 'modules/Auth/ResetPassword';
import Verification from 'modules/Auth/Verification';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import { NotFound } from 'ui/components/common/NotFound';
import RequireAuth from './RequireAuth';
import MainContainer from 'ui/components/common/Container/MainContainer';
import Dashboard from 'modules/Dashboard';
import Screen1 from 'ui/screens/Screen1';
import Screen2 from 'ui/screens/Screen2';
import Profile from 'ui/screens/Profile/index';
import LoginFull from 'modules/Auth/LoginFull';

const AuthLayout = React.lazy(() =>
  import('ui/components/common/Container/AuthContainer')
);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const DASHBOARD_PATH = '/';

export const AppRouter = () => {
  const { USER } = useSelector((state) => state.user);
  const hasAuth =
    !!USER &&
    USER?.uid &&
    (USER?.emailVerified ||
      (USER?.phoneNumber && USER.providerData[0].providerId === 'phone'));
  // showLog({ hasAuth });
  const protectedLayout = (
    <RequireAuth hasAuth={hasAuth}>
      <MainContainer />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<Dashboard />} />
          <Route path="screen1" element={<Screen1 />} />
          <Route path="screen2" element={<Screen2 />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/auth"
          element={
            <AuthLayoutFallback image={loginBackground} noAuth={!hasAuth} />
          }
        >
          <Route path="login" element={<LoginFull hasGoogleSignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verification" element={<Verification />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
