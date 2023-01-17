import { useState, useEffect } from 'react';

const Delayed = ({ children, delay = 500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    console.log(delay);
    setTimeout(() => {
      setIsShown(true);
    }, delay);
  }, [delay]);

  return isShown ? children : null;
};

export default Delayed;
