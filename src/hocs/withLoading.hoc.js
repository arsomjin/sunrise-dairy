import React, { Suspense } from 'react';
import Load from 'ui/components/common/Load';

export const withLoading = (Component) => {
  return (props) => (
    <Suspense fallback={<Load loading />}>
      <Component {...props} />
    </Suspense>
  );
};
