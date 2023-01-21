import React, { useContext, useState } from 'react';
import { useMergeState } from 'hooks';
import Load from 'ui/components/common/Load';
import ProgressLoader from 'ui/components/common/ProgressLoader';
import Updater from 'ui/components/common/Updater';
const LoadingContext = React.createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [progressing, setProgress] = useMergeState({
    show: false,
    percent: 0,
    text: null,
    subtext: null,
    onCancel: null,
  });
  const [updating, setUpdate] = useMergeState({
    show: false,
    text: undefined,
  });
  return (
    <LoadingContext.Provider
      value={{
        loading,
        progressing,
        updating,
        setLoading,
        setProgress,
        setUpdate,
      }}
    >
      {children}
      <ProgressLoader {...progressing} />
      <Updater {...updating} />
      <Load loading={loading} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
