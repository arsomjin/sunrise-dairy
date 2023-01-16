import React from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import tempSlice from 'store/slices/tempSlice';

const AlertModal = () => {
  const alertConfig = useSelector((state) => state['unPersisted'].alertConfig);
  const { title, content, buttons, ...props } = alertConfig || {};
  const dispatch = useDispatch();

  const handleOk = () => dispatch(tempSlice.actions.clearAlert());
  const handleCancel = () => dispatch(tempSlice.actions.clearAlert());

  return (
    <Modal
      open={alertConfig !== undefined}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={buttons}
      {...props}
    >
      {content}
    </Modal>
  );
};

export default AlertModal;
