import React from 'react';
import { useCollegeData } from '../../context/CollegeDataContext';

interface CollegeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'light' | 'dark' | 'auto';
  subtitle?: boolean;
  className?: string;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'auto',
  subtitle = true,
  className = ''
}) => {
  const { settings } = useCollegeData();

  const sizeDimensions = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    xs: 'text-[11px] leading-tight',
    sm: 'text-xs sm:text-[13px] font-bold leading-tight',
    md: 'text-sm font-extrabold leading-tight',
    lg: 'text-base font-extrabold leading-snug',
    xl: 'text-xl font-black leading-tight'
  };

  const textClasses =
    textColor === 'light'
      ? 'text-white'
      : textColor === 'dark'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  const subClasses =
    textColor === 'light'
      ? 'text-blue-200'
      : textColor === 'dark'
      ? 'text-slate-500'
      : 'text-slate-500 dark:text-slate-400';

  const logoSrc = settings.customLogoUrl || '/college-logo.svg';
  const collegeDisplayName = settings.collegeName || 'GOVERNMENT POLYTECHNIC BANSDIH, BALLIA';
  const collegeDisplayHindi = settings.hindiName || 'राजकीय पॉलिटेक्निक बांसडीह, बलिया';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative flex-shrink-0 ${sizeDimensions[size]} flex items-center justify-center`}>
        <img
          src={logoSrc}
          alt="Government Polytechnic Logo"
          className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback to svg emblem if custom URL fails
            (e.target as HTMLImageElement).src = '/college-logo.svg';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif tracking-tight font-extrabold ${titleSizes[size]} ${textClasses}`}>
            {collegeDisplayName}
          </span>
          {subtitle && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] uppercase font-semibold tracking-wider ${subClasses}`}>
                {collegeDisplayHindi}
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-amber-500"></span>
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                BTEUP Code: {settings.bteupCode || '4412'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
