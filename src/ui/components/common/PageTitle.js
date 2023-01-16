import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'constants';

const PageTitle = ({ children }) => {
  return (
    <Helmet>
      <title>
        {children} | {APP_NAME}
      </title>
    </Helmet>
  );
};

export default PageTitle;
