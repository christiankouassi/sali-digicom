import React from 'react';

export interface LogoProps {
  variant?: 'capital' | 'commodities' | 'dassouli' | 'digicom';
  type?: 'icon' | 'full' | 'horizontal' | 'stacked';
  className?: string;
  light?: boolean;
  badge?: boolean;
  srcOverride?: string;
  altOverride?: string;
}

/**
 * Official SALI DigiCom & Group Logotype Component
 * In accordance with Charte Graphique SALI DigiCom p. 7 ("Utiliser le logo mono sur fond marine"),
 * DigiCom variants default to high-resolution crisp monochrome white on #1C2C46 dark navy background.
 */
export function Logo({
  variant = 'digicom',
  type = 'horizontal',
  className = '',
  light = true,
  badge = false,
  srcOverride,
  altOverride,
}: LogoProps) {
  let src = srcOverride || '';
  let alt = altOverride || '';

  if (!src) {
    switch (variant) {
      case 'dassouli':
        src = light ? 'https://i.postimg.cc/x8t2xKd1/Dassouli.png' : 'https://i.postimg.cc/SRm07fwV/Dassouli.png';
        alt = 'Foncière Dassouli Logo';
        break;
      case 'commodities':
        src = 'https://i.postimg.cc/fbhrdVzD/5.png';
        alt = 'Sali Commodities Logo';
        break;
      case 'capital':
        src = 'https://i.postimg.cc/C573vfgr/LOGO-SALI.png';
        alt = 'Sali Capital Logo';
        break;
      case 'digicom':
      default:
        if (type === 'icon') {
          src = '/logo-digicom-white-icon.png';
          alt = 'SALI DigiCom Emblème SD';
        } else if (type === 'stacked') {
          src = '/logo-digicom-white-stacked.png';
          alt = 'SALI DigiCom Logo';
        } else {
          // 'horizontal' or 'full'
          src = '/logo-digicom-white-horizontal.png';
          alt = 'SALI DigiCom';
        }
        break;
    }
  } else if (!alt) {
    alt = `${variant} Logo`;
  }

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain select-none transition-all duration-300"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export default Logo;
