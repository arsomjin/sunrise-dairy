import { switchTheme } from 'store/slices/appSlice';
import { updateLan } from 'store/slices/appSlice';

export const initApp = (lan, i18n, dispatch) => {
  // dispatch(resetUserStates());
  // Init Language
  initLan(lan, i18n, dispatch);
  // Init Theme
  initTheme(dispatch);
};

export const initLan = (lan, i18n, dispatch) => {
  i18n.changeLanguage(typeof lan === 'undefined' ? i18n.language : lan);
  dispatch(
    updateLan({ lan: typeof lan === 'undefined' ? i18n.language : lan })
  );
};
export const initTheme = (dispatch) => {
  const localTheme = localStorage.getItem('theme');
  if (
    localTheme === 'dark' ||
    (!localTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    dispatch(switchTheme({ theme: 'dark' }));
  } else {
    dispatch(switchTheme({ theme: 'light' }));
  }
};
