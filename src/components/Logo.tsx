import React from 'react';

interface LogoProps {
  variant?: 'capital' | 'commodities' | 'dassouli' | 'digicom';
  type?: 'icon' | 'full';
  className?: string;
  light?: boolean; // Keep for compatibility with signature but ignore to prevent altering native colors
  badge?: boolean; // Keep for compatibility with signature but ignore to enforce pure transparent background
  srcOverride?: string; // Explicit URL override
}

export default function Logo({ variant = 'capital', type = 'icon', className = '', light = false, badge = false, srcOverride }: LogoProps) {
  // Source URLs mapped to the high-quality assets provided by the user
  let src = srcOverride || '';
  let alt = '';

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
      case 'digicom':
        src = '/logo-digicom-full.png';
        alt = 'Sali DigiCom Logo';
        break;
      case 'capital':
      default:
        src = 'https://i.postimg.cc/C573vfgr/LOGO-SALI.png';
        alt = 'Sali Capital Logo';
        break;
    }
  } else {
    alt = `${variant} Logo`;
  }

  // Pure native colors are maintained transparently with no filters as instructed by the user.
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      <img 
        src={src}
        alt={alt}
        className="w-full h-full object-contain select-none transition-all duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
