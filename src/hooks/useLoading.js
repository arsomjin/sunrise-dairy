import { Spin } from 'antd';
import React, { useContext, useState } from 'react';
import Load from 'ui/components/common/Load';

const LoadingContext = React.createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      {/* <Spin spinning={loading}>{children}</Spin> */}
      {children}
      <Load loading={loading} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
