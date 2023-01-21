import { createSlice } from '@reduxjs/toolkit';

export const initSystemAvailable = {
  stocks: {
    access: true,
  },
  reports: {
    access: true,
  },
};

const COLLAPSED_WIDTH = 80;
const NORMAL_WIDTH = 256;

export const initialStates = {
  isOnline: true,
  currentRoute: 'DASHBOARD',
  keyPath: [],
  available: initSystemAvailable,
  collapsed: false,
  sideBarWidth: NORMAL_WIDTH,
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
    updateCollapsed: (state, action) => {
      const { collapsed } = action.payload;
      Object.assign(state, {
        collapsed,
        sideBarWidth: collapsed ? COLLAPSED_WIDTH : NORMAL_WIDTH,
      });
    },
  },
});

export const { goOffline, goOnline, updateCurrentRoute, updateCollapsed } =
  tempSlicer.actions;

export default tempSlicer.reducer;
