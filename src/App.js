import React, { useEffect, useState } from 'react';
import { persistStore } from 'redux-persist';
import { store } from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import 'translations/i18n';
import { Provider } from 'react-redux';
import Splash from 'ui/components/common/Splash';
import Navigation from 'navigation';
import Load from 'ui/components/common/Load';
import { __DEV__ } from 'utils';
import './styles/css/app.css';
import 'antd/dist/reset.css';

const persistor = persistStore(store, null, () => {
  // const states = store.getState();
  // showLog('persist_state', states);
});

function App() {
  const onBeforeLift = () => {
    // showLog('PersistGate OPEN!');
  };
  return (
    <Provider store={store}>
      <PersistGate
        loading={!__DEV__ ? <Splash loading /> : <Load loading />}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <Navigation />
      </PersistGate>
    </Provider>
  );
}

export default App;
