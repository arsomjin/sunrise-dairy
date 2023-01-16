import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useDarkSide from 'hooks/useDarkSide';
import { useDispatch } from 'react-redux';
import { swithTheme } from 'store/slices/appSlice';

//TODO: Whenever the user explicitly chooses to respect the OS preference.
//Just remove key from localStorage. localStorage.removeItem('theme')
const ToggleTheme = ({ size, noColor, style, ...props }) => {
  const [colorTheme, setTheme] = useDarkSide();
  const dispatch = useDispatch();

  const toggleDarkMode = (checked) => {
    const nTheme = checked ? 'dark' : 'light';
    localStorage.setItem('theme', nTheme);
    setTheme(nTheme);
    dispatch(swithTheme({ theme: nTheme }));
  };

  return (
    <DarkModeSwitch
      style={style}
      checked={colorTheme === 'dark'}
      onChange={toggleDarkMode}
      // size={size || 30}
      moonColor="yellow"
      sunColor="orange"
      {...props}
    />
  );
};

export default ToggleTheme;
