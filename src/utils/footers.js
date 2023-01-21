import { FacebookFilled } from '@ant-design/icons';
import React from 'react';
import OpenApp from 'react-open-app';

export const Socials = ({ medium, large }) => {
  return (
    <OpenApp
      href="https://www.facebook.com/korat555"
      // android="fb://page/390277407694392"
      // ios="fb://page/?id=390277407694392"
    >
      <FacebookFilled
        className="text-secondary mt-4 "
        style={{ fontSize: medium ? '48px' : large ? '64px' : '24px' }}
      />
    </OpenApp>
  );
};
