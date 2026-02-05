import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import noDataImage from '@/assets/no-data-found.jpg';

interface CSPSafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

// Allowed external domains for image proxy
const ALLOWED_DOMAINS = [
  'digitaloceanspaces.com',
  'blr1.digitaloceanspaces.com',
  'ams-bucket.blr1.digitaloceanspaces.com',
  'leapmile-website.blr1.cdn.digitaloceanspaces.com'
];

// Check if URL is from an allowed external domain
const isAllowedExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

// Check if URL is external
const isExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * CSP-Safe Image Component
 * 
 * Handles external images by converting them to data URLs at runtime,
 * bypassing CSP img-src restrictions. Only processes allowed domains
 * to prevent open proxy abuse.
 */
export const CSPSafeImage = ({ 
  src, 
  alt, 
  className,
  fallbackSrc 
}: CSPSafeImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc || noDataImage);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallbackSrc || noDataImage);
      setIsLoading(false);
      return;
    }

    // If it's not an external URL, use it directly
    if (!isExternalUrl(src)) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // If it's an external URL from allowed domains, fetch and convert to data URL
    if (isAllowedExternalUrl(src)) {
      setIsLoading(true);
      fetchAndConvertToDataUrl(src)
        .then((dataUrl) => {
          setImageSrc(dataUrl);
          setHasError(false);
        })
        .catch(() => {
          setImageSrc(fallbackSrc || noDataImage);
          setHasError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // External URL not from allowed domain - use fallback
      setImageSrc(fallbackSrc || noDataImage);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc || noDataImage);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(className, isLoading && 'animate-pulse bg-muted')}
      onError={handleError}
    />
  );
};

// Cache for converted images
const imageCache = new Map<string, string>();

/**
 * Fetch an external image and convert it to a data URL
 * This bypasses CSP by serving the image as a data: URL
 */
async function fetchAndConvertToDataUrl(url: string): Promise<string> {
  // Check cache first
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Cache the result
        imageCache.set(url, dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Failed to load external image: ${url}`, error);
    throw error;
  }
}

export default CSPSafeImage;
