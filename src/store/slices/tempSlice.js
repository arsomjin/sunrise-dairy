import { createSlice } from '@reduxjs/toolkit';

export const initSystemAvailable = {
  stocks: {
    access: true,
  },
  reports: {
    access: true,
  },
};

export const initialStates = {
  isOnline: true,
  currentRoute: 'DASHBOARD',
  keyPath: [],
  available: initSystemAvailable,
};

export const tempSlicer = createSlice({
  name: 'tempSlice',
  initialState: initialStates,
  reducers: {
    goOnline: (state) => {
      Object.assign(state, { isOnline: true });
    },
    goOffline: (state) => {
      Object.assign(state, { isOnline: false });
    },
    updateCurrentRoute: (state, action) => {
      const { currentRoute, keyPath } = action.payload;
      Object.assign(state, { currentRoute, ...(keyPath && { keyPath }) });
    },
  },
});

export const { goOffline, goOnline, updateCurrentRoute } = tempSlicer.actions;

export default tempSlicer.reducer;
