import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useDispatch, useSelector } from 'react-redux';
import { switchTheme } from 'store/slices/appSlice';
import { showLog } from 'utils/functions/common';

//TODO: Whenever the user explicitly chooses to respect the OS preference.
//Just remove key from localStorage. localStorage.removeItem('theme')
const ToggleTheme = ({ size, noColor, style, ...props }) => {
  const { theme } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const toggleDarkMode = (checked) => {
    const nTheme = checked ? 'dark' : 'light';
    checked
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', nTheme);
    dispatch(switchTheme({ theme: nTheme }));
  };

  return (
    <DarkModeSwitch
      style={style}
      checked={theme === 'dark'}
      onChange={toggleDarkMode}
      // size={size || 30}
      moonColor="yellow"
      sunColor="orange"
      {...props}
    />
  );
};

export default ToggleTheme;
