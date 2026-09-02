import React, { useState, useEffect } from 'react';
import { Shirt } from 'lucide-react';
import { sanitizeUrl } from '../../utils/security';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
}

// Minimalist placeholder SVG data URI for instant standalone display
export const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400' fill='%23f3f4f6'><rect width='400' height='400' fill='%23f3f4f6'/><path d='M160 180c0-22.1 17.9-40 40-40s40 17.9 40 40-17.9 40-40 40-40-17.9-40-40zm-60 120c0-33.1 26.9-60 60-60h80c33.1 0 60 26.9 60 60v20H100v-20z' fill='%23d1d5db'/></svg>";

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Изображение',
  className = '',
  containerClassName = '',
  fallbackSrc = DEFAULT_PLACEHOLDER,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const safeSrc = sanitizeUrl(src, '');

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!safeSrc || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-[#161616] text-gray-400 dark:text-gray-600 select-none ${className} ${containerClassName}`}
        title="Изображение недоступно"
        data-testid="safe-image-placeholder"
      >
        <Shirt className="w-8 h-8 opacity-40 mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
          KitapAll
        </span>
      </div>
    );
  }

  return (
    <img
      src={safeSrc}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      className={`${className} ${isLoading ? 'opacity-80 scale-[0.99] transition-opacity' : 'opacity-100 transition-opacity'}`}
      {...props}
    />
  );
};
