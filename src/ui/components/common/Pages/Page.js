import React from 'react';
import BarTitle from '../BarTitle';
import PageTitle from './PageTitle';

const Page = ({ children, title, subtitle, ...props }) => {
  return (
    <>
      <BarTitle>{title || ''}</BarTitle>
      <div className="h-full p-2" {...props}>
        {(!!title || !!subtitle) && (
          <PageTitle title={title} subtitle={subtitle} />
        )}
        {children}
      </div>
    </>
  );
};

export default Page;
