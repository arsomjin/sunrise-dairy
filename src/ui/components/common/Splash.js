import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import logo from '../../../logo.svg';

const Splash = forwardRef((props, ref) => {
  const { theme } = useSelector((state) => state.global);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}
    >
      <img
        src={logo}
        className="h-52 logo-spin pointer-events-none"
        alt="logo"
      />
    </div>
  );
});

export default Splash;
