import React from 'react';
import logo from 'assets/logo/favicon-32x32.png';
import { APP_NAME } from 'constants';

const CompanyLogo = ({ logoOnly, size, ...props }) => {
  const mStyle = logoOnly
    ? {}
    : {
        display: 'flex',
        alignItems: 'center',
      };
  return (
    <div style={{ ...mStyle, ...props.style }}>
      <img src={logo} alt="" {...(size && { style: { height: size } })} />
      {!logoOnly && (
        <h5 className="text-md text-primary mt-3 ml-2 mr-2">
          {APP_NAME.toUpperCase()}
        </h5>
      )}
    </div>
  );
};

export default CompanyLogo;
