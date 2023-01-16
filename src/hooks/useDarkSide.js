import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { swithTheme } from 'store/slices/appSlice';

export default function useDarkSide() {
  const [colorTheme, setTheme] = useState(localStorage.getItem('theme'));
  const dispatch = useDispatch();
  useEffect(() => {
    let theme = localStorage.getItem('theme');
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      dispatch(swithTheme({ theme: 'dark' }));
    } else {
      document.documentElement.classList.remove('dark');
      dispatch(swithTheme({ theme: 'light' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorTheme]);

  return [colorTheme, setTheme];
}
