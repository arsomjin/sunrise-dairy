import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import pwaReducer from './slices/pwaSlice';
import tempReducer from './slices/tempSlice';

export const reducer = combineReducers({
  user: userReducer || (() => ({})),
  global: appReducer || (() => ({})),
  pwa: pwaReducer || (() => ({})),
  unPersisted: tempReducer || (() => ({})),
});
