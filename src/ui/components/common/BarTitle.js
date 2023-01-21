import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'constants';

const BarTitle = ({ children }) => {
  return (
    <Helmet>
      <title>
        {children} | {APP_NAME}
      </title>
    </Helmet>
  );
};

export default BarTitle;
