import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { switchTheme } from 'store/slices/appSlice';
import ToggleLan from '../ToggleLan';

const AuthLayout = ({
  image = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80',
  noAuth,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Switch to light theme because auth page is not supported dark mode by design.
    // And we don't store the value to localStorage because we want to persist the previous theme when user signed-in.
    document.documentElement.classList.remove('dark');
    dispatch(switchTheme({ theme: 'light' }));
  }, [dispatch]);

  return noAuth ? (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-no-repeat bg-cover relative"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div
        className="absolute bg-gradient-to-b from-blue-500 to-blue-400 opacity-75 inset-0 z-0"
        // className={`absolute bg-gradient-to-b from-${themeColor}-500 to-${themeColor}-400 opacity-75 inset-0 z-0`}
      ></div>
      <ToggleLan
        style={{ position: 'absolute', top: 50, right: 50, color: 'white' }}
        size="large"
      />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AuthLayout;
