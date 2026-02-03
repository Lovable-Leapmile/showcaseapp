import { useEffect } from 'react';
import { UI_SKIN } from '@/config/theme';

// Apply the theme skin class to the document root on app initialization
export const ThemeInitializer = () => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove any existing skin classes
    root.classList.remove('skin-ams', 'skin-leapmile');
    
    // Add the current skin class
    if (UI_SKIN === 'AMS_UI') {
      root.classList.add('skin-ams');
    } else {
      root.classList.add('skin-leapmile');
    }
    
    console.log(`Applied UI skin: ${UI_SKIN}`);
  }, []);
  
  return null;
};
