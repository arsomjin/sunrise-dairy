import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { persistConfig } from './persistConfig';
import { createLogger } from 'redux-logger';
import { batchedSubscribe } from 'redux-batched-subscribe';
import thunk from 'redux-thunk';
import { debounce } from 'lodash';
import { reducer } from './combineReducer';
import { __DEV__ } from 'utils';
import { errorLoggingMiddleware } from './middlewares/errorLogging.middleware';

const debounceNotify = debounce((notify) => notify());

export const configStore = (preloadedState) => {
  const logger = createLogger({
    collapsed: true,
    duration: true,
    predicate: (getState, action) => __DEV__,
  });

  const middleware = __DEV__ ? [thunk, logger] : [thunk];

  const customPersistReducer = persistReducer(persistConfig, reducer);

  // syncFirebase(store);

  const store = configureStore({
    reducer: customPersistReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .concat(middleware)
        .concat(errorLoggingMiddleware),
    devTools: __DEV__,
    preloadedState,
    enhancers: [batchedSubscribe(debounceNotify)],
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./combineReducer', () => store.replaceReducer(reducer));
  }

  return store;
};

export const store = configStore();
