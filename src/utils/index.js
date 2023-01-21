import * as Device from 'react-device-detect';

import { DEFAULT_LAN } from 'constants/Lan';

export const __DEV__ = process.env.NODE_ENV !== 'production';

export const screenWidth =
  typeof window !== 'undefined' ? window.innerWidth : 0;
export const screenHeight =
  typeof window !== 'undefined' ? window.innerHeight : 0;

// Retrieve languages from 'react-browser-navigator'
export const getBrowserLanguage = (languages) =>
  !!languages
    ? Array.isArray(languages)
      ? languages[0].indexOf('en') > -1
        ? languages[0].substring(0, 2)
        : DEFAULT_LAN
      : DEFAULT_LAN
    : DEFAULT_LAN;

export const isDarkTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const getCurrentDevice = () => {
  const {
    isAndroid,
    isBrowser,
    isChrome,
    isChromium,
    isConsole,
    isEdge,
    isEdgeChromium,
    isElectron,
    isFirefox,
    isIE,
    isIOS,
    isIOS13,
    isIPad13,
    isIPhone13,
    isIPod13,
    isLegacyEdge,
    isMacOs,
    isMobile,
    isMobileOnly,
    isMobileSafari,
    isOpera,
    isSafari,
    isSmartTV,
    isTablet,
    isWearable,
    isWinPhone,
    isWindows,
    isYandex,
    mobileModel,
    mobileVendor,
    osName,
    osVersion,
  } = Device;
  return {
    isAndroid,
    isBrowser,
    isChrome,
    isChromium,
    isConsole,
    isEdge,
    isEdgeChromium,
    isElectron,
    isFirefox,
    isIE,
    isIOS,
    isIOS13,
    isIPad13,
    isIPhone13,
    isIPod13,
    isLegacyEdge,
    isMacOs,
    isMobile,
    isMobileOnly,
    isMobileSafari,
    isOpera,
    isSafari,
    isSmartTV,
    isTablet,
    isWearable,
    isWinPhone,
    isWindows,
    isYandex,
    mobileModel,
    mobileVendor,
    osName,
    osVersion,
  };
};
