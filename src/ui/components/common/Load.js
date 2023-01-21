import React, { useState, forwardRef, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import * as animationData from 'assets/animation/49491-milk.json';

const Load = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(props.loading || false);

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="absolute flex bg-slate-50 dark:bg-slate-400 opacity-70 inset-0 z-20  items-center justify-center">
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ height: 320, width: 320 }}
      />
      {props?.text && (
        <div className="text-muted" style={{ marginLeft: -30 }}>
          {props.text || 'กรุณารอสักครู่...'}
        </div>
      )}
    </div>
  );
});

export default Load;
