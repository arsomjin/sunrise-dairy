import React, { useEffect } from 'react';
import { useMergeState } from 'hooks';
import { Spin } from 'antd';

const Updater = (props) => {
  const [cState, setCState] = useMergeState({
    show: typeof props.show !== 'undefined' ? props.show : false,
    text: props.text || undefined,
  });

  useEffect(() => {
    setCState({
      show: typeof props.show !== 'undefined' ? props.show : false,
      text: props.text || undefined,
    });
  }, [props.show, props.subtext, props.text, setCState]);

  if (!cState.show) {
    return null;
  }

  return (
    <div className="absolute flex flex-col bg-slate-50 dark:bg-slate-400 opacity-70 inset-0 z-20  items-center justify-center">
      <Spin tip={cState.text} />
    </div>
  );
};

export default Updater;
