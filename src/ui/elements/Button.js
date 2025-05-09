import React, { forwardRef } from 'react';
import { Button } from 'antd';

export default forwardRef((props, ref) => {
  return (
    <Button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}
      {...props}
    />
  );
});
