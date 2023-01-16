import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { convertSeconds } from 'utils/functions/times';

const CountdownTimer = ({
  size,
  noButtons,
  startWhenMounted,
  seconds,
  onFinish,
}) => {
  const [secs, setSeconds] = useState(seconds || 60);
  const [counting, setCounting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    !!startWhenMounted && startTimer();
    return () => !!timerRef.current && clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = () => {
    if (!counting) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(timerRef.current);
            !!onFinish && onFinish();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
      setCounting(true);
    } else {
      clearInterval(timerRef.current);
      setCounting(false);
    }
  };

  const resetTimer = () => {
    setSeconds(seconds || 60);
  };

  return (
    <div className="items-center justify-center">
      <div>{convertSeconds(secs)}</div>
      {!noButtons && (
        <div className="flex items-center">
          <Button type="ghost" onClick={startTimer}>
            {counting ? 'Stop Timer' : 'Start Timer'}
          </Button>
          <Button type="ghost" title="Reset Timer" onClick={resetTimer}>
            Reset Timer
          </Button>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
