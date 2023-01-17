import { createSlice } from '@reduxjs/toolkit';
import 'numeral/locales/th';
import dayjs from 'dayjs';
const numeral = require('numeral');

export const initialStates = {
  theme: 'dark',
  nightMode: undefined,
  lan: undefined,
  device: undefined,
};

export const appSlicer = createSlice({
  name: 'appSlice',
  initialState: initialStates,
  reducers: {
    switchTheme: (state, action) => {
      const { theme } = action.payload;
      return {
        ...state,
        theme,
        nightMode: theme === 'dark',
      };
    },
    getDevice: (state, action) => {
      const { device } = action.payload;
      Object.assign(state, { device });
    },
    updateLan: (state, action) => {
      const { lan } = action.payload;
      numeral.locale(lan);
      dayjs.locale(lan);
      return { ...state, lan };
    },
    updateSystemAvailable: (state, action) => {
      const { available } = action.payload;
      return { ...state, available };
    },
    resetGlobalStates: (state) => {
      return initialStates;
    },
  },
});

export const {
  switchTheme,
  getDevice,
  updateLan,
  getCurrentScene,
  updateSystemAvailable,
  resetGlobalStates,
} = appSlicer.actions;

export default appSlicer.reducer;
