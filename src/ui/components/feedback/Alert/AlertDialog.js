import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { Modal } from 'antd';
import { useMergeState } from 'hooks';
import { waitFor } from 'utils/functions/common';

const AlertDialog = forwardRef((props, ref) => {
  const [cState, setCState] = useMergeState({
    visible: false,
    title: 'Alert',
    content: 'Information',
    buttons: [],
    onOk: () => {},
  });

  const _hide = useCallback(() => {
    setCState({ visible: false });
  }, [setCState]);

  const _setNewState = useCallback(
    (mProps) => {
      setCState({
        visible: typeof mProps.visible !== 'undefined' ? mProps.visible : false,
        title: mProps.title || 'Alert',
        content:
          typeof mProps.content !== 'undefined'
            ? mProps.content
            : 'Information',
        onOk: () => (mProps.onOk ? mProps.onOk() : _hide()),
      });
    },
    [_hide, setCState]
  );

  const _show = useCallback(
    async (mProps) => {
      // showLog('newStates', mProps);
      setCState({
        visible: true,
        title: mProps.title || 'Alert',
        content:
          typeof mProps.content !== 'undefined'
            ? mProps.content
            : 'Information',
        onOk: () => (mProps.onOk ? mProps.onOk() : _hide()),
      });
      await waitFor(5000);
      _hide();
    },
    [_hide, setCState]
  );

  useImperativeHandle(
    ref,
    () => ({
      setNewState: (mProps) => _setNewState(mProps),
      showAlert: (mProps) => _show(mProps),
      hideAlert: () => _hide(),
    }),
    [_hide, _setNewState, _show]
  );

  if (!cState.visible) {
    return null;
  }

  // showLog('Render_Alert', cState);
  return (
    <Modal
      open={cState.visible}
      title={cState.title}
      onOk={cState.onOk}
      footer={cState.buttons}
    >
      {cState.content}
    </Modal>
  );
});

export default AlertDialog;
