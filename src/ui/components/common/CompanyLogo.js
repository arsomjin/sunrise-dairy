import React from 'react';
import logo from 'assets/logo-new/roongaroon-dairy.jpg';
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
      <div style={{
        width: size || 32,
        height: size || 32,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={logo}
          alt={APP_NAME}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {!logoOnly && (
        <h5 className="text-md text-primary mt-3 ml-2 mr-2">
          {APP_NAME.toUpperCase()}
        </h5>
      )}
    </div>
  );
};

export default CompanyLogo;
