import { useEffect } from 'react';
import { UI_SKIN, isLeapmileSkin, isAMSSkin, type UISkin } from '@/config/theme';
import amsLogo from '@/assets/ams-logo.png';
import leapmileLogo from '@/assets/leapmile-logo.png';

// Hook to get the current theme configuration
export const useTheme = () => {
  const skin = UI_SKIN;
  
  useEffect(() => {
    // Apply the skin class to the document root
    const root = document.documentElement;
    
    // Remove any existing skin classes
    root.classList.remove('skin-ams', 'skin-leapmile');
    
    // Add the current skin class
    if (isAMSSkin()) {
      root.classList.add('skin-ams');
    } else {
      root.classList.add('skin-leapmile');
    }
  }, [skin]);
  
  return {
    skin,
    isAMS: isAMSSkin(),
    isLeapmile: isLeapmileSkin(),
  };
};

// Get the appropriate logo based on current skin
export const useAppLogo = () => {
  return isLeapmileSkin() ? leapmileLogo : amsLogo;
};

// Get the app name based on current skin
export const useAppName = () => {
  return isLeapmileSkin() ? 'Leapmile' : 'AMS';
};

// Get the app description based on current skin
export const useAppDescription = () => {
  return isLeapmileSkin() ? 'Leapmile Showcase' : 'AMS Showcase';
};

// Export static versions for use outside of React components
export const getAppLogo = () => isLeapmileSkin() ? leapmileLogo : amsLogo;
export const getAppName = () => isLeapmileSkin() ? 'Leapmile' : 'AMS';
export const getAppDescription = () => isLeapmileSkin() ? 'Leapmile Showcase' : 'AMS Showcase';
