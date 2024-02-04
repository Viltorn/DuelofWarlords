import { useState, useEffect } from 'react';

const useResizeWindow = () => {
  const [fontVal, setFontVal] = useState(0);
  useEffect(() => {
    const handleWindowResize = () => {
      clearTimeout(window.resizelag);
      window.resizelag = setTimeout(() => {
        delete window.resizelag;
        const windowAspectRatio = window.innerWidth / window.innerHeight;
        const fontValue = windowAspectRatio <= 2 ? window.innerWidth / 88 : window.innerHeight / 44;
        document.documentElement.style.setProperty('font-size', `${fontValue}px`);
        setFontVal(fontValue);
      }, 300);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return fontVal;
};

export default useResizeWindow;
