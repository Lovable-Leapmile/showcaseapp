import { cn } from '@/lib/utils';
import noDataImage from '@/assets/no-data-found.jpg';
import { useState } from 'react';

interface CSPSafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

// DigitalOcean Spaces base URL to strip
const DO_SPACES_BASE = 'https://ams-bucket.blr1.digitaloceanspaces.com/';

/**
 * CSP-Safe Image Component
 * 
 * Routes external DigitalOcean Spaces images through the backend proxy endpoint
 * to satisfy CSP img-src 'self' policy.
 * 
 * Transforms: https://ams-bucket.blr1.digitaloceanspaces.com/Piston.png
 * Into: {VITE_BASE_URL}/showcase/assets/image?path=Piston.png
 */
export const CSPSafeImage = ({ 
  src, 
  alt, 
  className,
  fallbackSrc 
}: CSPSafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  const getProxiedSrc = (): string => {
    if (!src) {
      return fallbackSrc || noDataImage;
    }

    // If it's a DigitalOcean Spaces URL, proxy through backend
    if (src.startsWith(DO_SPACES_BASE)) {
      const imagePath = src.replace(DO_SPACES_BASE, '');
      return `${import.meta.env.VITE_BASE_URL}/showcase/assets/image?path=${encodeURIComponent(imagePath)}`;
    }

    // If it's already a relative URL or data URL, use directly
    if (src.startsWith('/') || src.startsWith('data:')) {
      return src;
    }

    // For other external URLs, use fallback (they won't work with CSP)
    return fallbackSrc || noDataImage;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const imageSrc = hasError ? (fallbackSrc || noDataImage) : getProxiedSrc();

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(className)}
      onError={handleError}
    />
  );
};

export default CSPSafeImage;
