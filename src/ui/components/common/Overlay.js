import React from 'react';

const Overlay = ({ show, children }) => {
  return show ? (
    <div className="absolute z-10 w-100vw h-100vh">{children}</div>
  ) : (
    <div className="absolute z-10 h-0" />
  );
};

export default Overlay;
