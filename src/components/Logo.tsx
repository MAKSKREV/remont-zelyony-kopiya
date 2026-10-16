import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const titleSize = size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-base sm:text-xl' : 'text-sm sm:text-base';
  const subtitleSize = size === 'sm' ? 'text-[7px] sm:text-[8px]' : size === 'lg' ? 'text-[9px] sm:text-[11px]' : 'text-[8px] sm:text-[10px]';

  const textColor = isLight ? 'text-white' : 'text-[#034a7a]';
  const subTextColor = isLight ? 'text-gray-300' : 'text-[#0369a1]';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <img
        src="/logo.png"
        alt="Logo"
        className="shrink-0 rounded-sm object-contain"
        style={{ width: iconSize, height: iconSize }}
      />

      <div className="flex flex-col justify-center">
        <span
          className={`font-montserrat font-extrabold ${titleSize} tracking-tight leading-none ${textColor}`}
        >
          РЕМОНТ ПОД КЛЮЧ
        </span>
        <span
          className={`font-inter font-semibold ${subtitleSize} tracking-[0.16em] uppercase leading-tight mt-1 ${subTextColor}`}
        >
          ТОЧНОСТЬ В КАЖДОМ РЕШЕНИИ
        </span>
      </div>
    </div>
  );
};
