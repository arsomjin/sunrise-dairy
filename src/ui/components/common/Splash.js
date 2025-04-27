import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import logo from 'assets/logo-new/roongaroon-dairy.png';

const Splash = forwardRef((props, ref) => {
  const { theme } = useSelector((state) => state.global);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}
    >
      <img
        src={logo}
        className="pointer-events-none"
        alt="logo"
        style={{
          height: '120px',  // Adjusted from h-52 to a fixed height
          width: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
});

export default Splash;
