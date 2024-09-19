import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

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
import Private from './Private';
import MainContainer from '../Container/MainContainer';
import Dashboard from 'modules/Dashboard';
import Screen1 from 'ui/screens/Screen1';
import Screen2 from 'ui/screens/Screen2';
import Profile from 'ui/screens/Profile/index';
import LoginFull from 'modules/Auth/LoginFull';
import Weight from 'modules/Milk/Weight';
import UploadFromExcel from 'ui/components/common/UploadFromExcel';
import Welcome from 'ui/screens/Welcome';
import { showLog } from 'utils/functions/common';
import About from 'ui/screens/About';
import QCResult from 'modules/Reports/Milk/QCResult';
import DailyQCReport from 'modules/Reports/Milk/DailyQCReport';
import DailyQC from 'modules/Milk/QC/DailyQC';
import MilkQC from 'modules/Milk/QC/MilkQC';
import Pricing from 'modules/Milk/Pricing';
import Users from 'modules/Persons/Users';
import Employees from 'modules/Persons/Employees';
import Members from 'modules/Persons/Members';
import CheckData from 'modules/Developer/CheckData';
import DailySummaryReport from 'modules/Reports/Milk/DailySummaryReport';

const AuthLayout = React.lazy(() => import('../Container/AuthContainer'));

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const DASHBOARD_PATH = '/';
export const MILK_PATH = '/milk';
export const UTILS_PATH = '/utils';
export const PERSON_PATH = '/persons';
export const DEV_PATH = '/developer';

export const AppRouter = () => {
  const { USER, profile } = useSelector((state) => state.user);
  const hasAuth =
    !!USER &&
    USER?.uid &&
    (USER?.emailVerified ||
      (USER?.phoneNumber && USER.providerData[0].providerId === 'phone'));

  const isCustomer =
    profile?.permissions &&
    ['member', 'undefined'].includes(profile.permissions?.role);

  const isPrivated =
    profile?.permissions &&
    !['member', 'undefined'].includes(profile.permissions?.role);

  // showLog({ hasAuth });
  const protectedLayout = (
    <RequireAuth hasAuth={hasAuth}>
      {profile?.permissions && profile.permissions?.granted ? (
        <MainContainer />
      ) : (
        <Welcome />
      )}
    </RequireAuth>
  );

  const privatedLayout = (
    <Private isPrivated={isPrivated}>
      <Outlet />
    </Private>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={isCustomer ? <Profile /> : <Dashboard />} />
          <Route path="screen1" element={<Screen1 />} />
          <Route path="screen2" element={<Screen2 />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path={MILK_PATH}>
            <Route element={privatedLayout}>
              <Route index element={<Weight />} />
              <Route path="weight" element={<Weight />} />
              <Route path="milk-daily-test" element={<DailyQC />} />
              <Route path="milk-qc" element={<MilkQC />} />
            </Route>
            <Route path="milk-qc-report" element={<QCResult />} />
            <Route path="milk-daily-report" element={<DailyQCReport />} />
            <Route
              path="daily-summary-report"
              element={<DailySummaryReport />}
            />
            <Route path="pricing" element={<Pricing />} />
          </Route>
          <Route path={PERSON_PATH} element={privatedLayout}>
            <Route path="users" element={<Users />} />
            <Route path="users_pending" element={<Users isPending />} />
            <Route path="employees" element={<Employees />} />
            <Route path="members" element={<Members />} />
          </Route>
          <Route path={UTILS_PATH}>
            <Route
              path="upload-data-from-excel-file"
              element={<UploadFromExcel />}
            />
          </Route>
          <Route path={DEV_PATH}>
            <Route path="check_data" element={<CheckData />} />
          </Route>
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
