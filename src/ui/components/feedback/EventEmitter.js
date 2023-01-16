import React, { Fragment, useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import FlashMessage from 'react-native-flash-message';
import LoaderRegister from './Loader/LoaderRegister';
import UpdaterRegister from './Updater//UpdaterRegister';
import ActionSheetRegister from './ActionSheet/ActionSheetRegister';
import PinCodeRegister from './PinCode/PinCodeRegister';
import SuccessRegister from './Success/SuccessRegister';
import SearchRegister from './Search/SearchRegister';
import NoWifi from 'elements/NoWifi';
import AlertDialogRegister from './AlertDialog/AlertDialogRegister';

const EventEmitter = () => {
  useEffect(() => {
    RNLocalize.addEventListener('change', _handleLocalizationChange);

    return () => {
      RNLocalize.removeEventListener('change', _handleLocalizationChange);
    };
  }, []);

  const _handleLocalizationChange = async localize => {
    console.log('localization_change', localize);
  };

  return (
    <Fragment>
      <SearchRegister />
      <ActionSheetRegister />
      <PinCodeRegister />
      <LoaderRegister />
      <UpdaterRegister />
      <SuccessRegister />
      <NoWifi />
      <AlertDialogRegister />
      <FlashMessage position="top" />
    </Fragment>
  );
};

export default EventEmitter;
