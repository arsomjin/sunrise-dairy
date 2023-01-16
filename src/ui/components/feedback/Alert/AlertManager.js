const { store } = require('context/store');
import { updateShowAlert } from '../../../context/tempSlice';

module.exports = {
  _currentAlertDialog: null,
  registerAlertDialog(AlertDialog) {
    this._currentAlertDialog = AlertDialog;
  },
  unregisterAlertDialog() {
    this._currentAlertDialog = null;
  },
  showAlert(newState = null) {
    if (this._currentAlertDialog === null) {
      return;
    }

    // Hide the current alert
    // this.hideAlert();
    if (newState !== null) {
      // Clear current state
      // this._currentAlertDialog.setNewState({});

      // this._currentAlertDialog.setNewState(newState);

      setTimeout(() => {
        this._currentAlertDialog.showAlertDialog(newState);
        store.dispatch(updateShowAlert({ alertShow: true }));
      }, 100);
    }
  },
  hideAlert() {
    if (this._currentAlertDialog !== null) {
      this._currentAlertDialog.hideAlertDialog();
      store.dispatch(updateShowAlert({ alertShow: false }));
    }
  }
};
