import React, { useEffect, useState } from 'react';
import { Progress as AProgress } from 'antd';

const Progress = ({
  percent = 0,
  type = 'circle',
  strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
}) => {
  const [progress, setPercent] = useState(percent);
  useEffect(() => {
    setPercent(percent);
  }, [percent]);

  return <AProgress {...{ percent: progress, type, strokeColor }} />;
};

export default Progress;
