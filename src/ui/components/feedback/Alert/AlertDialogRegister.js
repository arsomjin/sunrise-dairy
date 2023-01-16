import React, { useRef, useEffect } from 'react';
import AlertDialog from './AlertDialog';
import AlertManager from './AlertManager';

export default () => {
  useEffect(() => {
    // Register the alert located on this master page
    // This AlertDialog will be accessible from the current (same) component, and from its child component
    // The AlertDialog is then declared only once, in your main component.
    AlertManager.registerAlertDialog(alertRef);
    return () => {
      // Remove the alert located on this master page from the manager
      AlertManager.unregisterAlertDialog();
    };
  }, []);

  let alertRef = useRef();

  return (
    <AlertDialog
      ref={ref => {
        alertRef = ref;
      }}
    />
  );
};
