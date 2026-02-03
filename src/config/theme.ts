// UI Skin Configuration
// Controlled by VITE_DEPLOYMENT_CSS_SKIN environment variable
// Supported values: AMS_UI, LEAPMILE_UI (default)

export type UISkin = 'AMS_UI' | 'LEAPMILE_UI';

const VALID_SKINS: UISkin[] = ['AMS_UI', 'LEAPMILE_UI'];
const DEFAULT_SKIN: UISkin = 'LEAPMILE_UI';

// Get the current UI skin from environment variable
export const getUISkin = (): UISkin => {
  const envSkin = import.meta.env.VITE_DEPLOYMENT_CSS_SKIN;
  
  if (!envSkin || !VALID_SKINS.includes(envSkin as UISkin)) {
    return DEFAULT_SKIN;
  }
  
  return envSkin as UISkin;
};

// Current active skin
export const UI_SKIN = getUISkin();

// Check if specific skin is active
export const isAMSSkin = (): boolean => UI_SKIN === 'AMS_UI';
export const isLeapmileSkin = (): boolean => UI_SKIN === 'LEAPMILE_UI';

// Theme color configurations (for reference - actual values in CSS)
export const THEME_COLORS = {
  AMS_UI: {
    primary: '185 76% 23%', // Teal #0E5E65
    primaryForeground: '0 0% 98%',
    secondary: '180 45% 96%', // Light teal #F0F9F9
    secondaryForeground: '185 76% 23%',
    muted: '180 45% 96%',
    mutedForeground: '185 30% 40%',
    accent: '180 45% 96%',
    accentForeground: '185 76% 23%',
    success: '142 55% 46%', // #4F9D69
    warning: '43 70% 50%', // #D4A62A
    destructive: '0 84.2% 60.2%', // #C84C5A
  },
  LEAPMILE_UI: {
    primary: '260 61% 28%', // Deep Purple #351C75
    primaryForeground: '0 0% 100%',
    secondary: '261 40% 66%', // Light Purple #8E7CC3
    secondaryForeground: '0 0% 100%',
    muted: '261 50% 93%', // Light Lavender #E9E4F5
    mutedForeground: '259 20% 49%', // Secondary Text #6E6893
    accent: '261 50% 93%', // Light Lavender #E9E4F5
    accentForeground: '260 61% 28%',
    success: '142 40% 46%', // #4F9D69
    warning: '43 70% 50%', // #D4A62A
    destructive: '351 50% 54%', // #C84C5A
  },
} as const;
