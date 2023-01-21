import React from 'react';
import PageTitle from './PageTitle';

const Page = ({ children, title, subtitle, ...props }) => {
  return (
    <div className="h-full p-2" {...props}>
      {(!!title || !!subtitle) && (
        <PageTitle title={title} subtitle={subtitle}>
          {children}
        </PageTitle>
      )}
    </div>
  );
};

export default Page;
