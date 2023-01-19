import * as Device from 'react-device-detect';

import { DEFAULT_LAN } from 'constants/Lan';

export const __DEV__ = process.env.NODE_ENV !== 'production';

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

export const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

export const hexToHSL = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    // eslint-disable-next-line no-unused-expressions
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error('Non valid HEX color');
  }
};

export const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};
