import React from 'react';
import { GlobalSpinner } from 'ui/components/common/GlobalSpinner';
import { useSelector } from 'react-redux';

export const Loading = ({ size, color }) => {
  const theme = useSelector((state) => state.global.theme);
  const spinnerColor = color;

  return (
    <div className="h-full w-full flex items-center justify-center">
      <GlobalSpinner size={size} color={spinnerColor} />
    </div>
  );
};
