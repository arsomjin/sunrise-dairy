import storage from 'redux-persist/lib/storage';
import { __DEV__ } from 'utils';

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['unPersisted'],
  debug: __DEV__,
  timeout: 400, // To make the PersistGate open quicker. But timeout depends on the size of persisted data.
};
