import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Pixel-art Student Character with headphones and backpack
 */
export const PixelStudent: React.FC<IconProps> = ({ className = 'w-16 h-16', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    {/* Hair / Headphone headband */}
    <rect x="7" y="2" width="10" height="2" fill="#B8A5FF" />
    <rect x="5" y="3" width="2" height="5" fill="#B8A5FF" />
    <rect x="17" y="3" width="2" height="5" fill="#B8A5FF" />
    {/* Hair top */}
    <rect x="7" y="4" width="10" height="3" fill="#3B4268" />
    <rect x="6" y="5" width="2" height="4" fill="#3B4268" />
    {/* Headphone earcups */}
    <rect x="4" y="6" width="3" height="4" fill="#C8FF70" />
    <rect x="17" y="6" width="3" height="4" fill="#C8FF70" />
    {/* Face */}
    <rect x="7" y="7" width="10" height="7" fill="#F5F0DF" />
    {/* Pixel Sunglasses / Glasses */}
    <rect x="8" y="9" width="3" height="2" fill="#111522" />
    <rect x="13" y="9" width="3" height="2" fill="#111522" />
    <rect x="11" y="9" width="2" height="1" fill="#111522" />
    {/* Slight sweat drop */}
    <rect x="16" y="8" width="1" height="2" fill="#60A5FA" />
    {/* Neutral/Worried Mouth */}
    <rect x="10" y="12" width="4" height="1" fill="#FF657A" />
    {/* Hoodie Body */}
    <rect x="6" y="14" width="12" height="6" fill="#20243A" />
    <rect x="9" y="14" width="6" height="5" fill="#FFC857" />
    {/* Backpack straps */}
    <rect x="6" y="15" width="2" height="5" fill="#3B4268" />
    <rect x="16" y="15" width="2" height="5" fill="#3B4268" />
    {/* Legs / Jeans */}
    <rect x="7" y="20" width="4" height="3" fill="#1E293B" />
    <rect x="13" y="20" width="4" height="3" fill="#1E293B" />
    {/* Shoes */}
    <rect x="6" y="23" width="5" height="1" fill="#C8FF70" />
    <rect x="13" y="23" width="5" height="1" fill="#C8FF70" />
  </svg>
);

/**
 * Pixel-art Wallet with coin sticking out
 */
export const PixelWallet: React.FC<IconProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    {/* Gold coin popping out */}
    <rect x="11" y="2" width="6" height="2" fill="#FFC857" />
    <rect x="9" y="4" width="10" height="4" fill="#FFC857" />
    <rect x="12" y="5" width="4" height="2" fill="#FFEAA7" />
    {/* Wallet outline & body */}
    <rect x="3" y="7" width="18" height="14" fill="#20243A" />
    <rect x="4" y="8" width="16" height="12" fill="#3B4268" />
    {/* Wallet fold */}
    <rect x="4" y="12" width="16" height="2" fill="#1E2235" />
    {/* Golden clasp */}
    <rect x="15" y="11" width="5" height="4" fill="#FFC857" />
    <rect x="17" y="12" width="2" height="2" fill="#111522" />
    {/* Stitching accents */}
    <rect x="4" y="8" width="1" height="1" fill="#C8FF70" />
    <rect x="6" y="8" width="1" height="1" fill="#C8FF70" />
    <rect x="8" y="8" width="1" height="1" fill="#C8FF70" />
  </svg>
);

/**
 * Pixel Gold Coin
 */
export const PixelCoin: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    <rect x="5" y="1" width="6" height="2" fill="#000000" />
    <rect x="3" y="3" width="10" height="10" fill="#000000" />
    <rect x="5" y="13" width="6" height="2" fill="#000000" />
    <rect x="6" y="2" width="4" height="12" fill="#FFC857" />
    <rect x="4" y="4" width="8" height="8" fill="#FFC857" />
    <rect x="5" y="4" width="2" height="4" fill="#FFF4CC" />
    <rect x="7" y="5" width="2" height="6" fill="#D99B26" />
    <rect x="9" y="7" width="2" height="2" fill="#D99B26" />
  </svg>
);

/**
 * Pixel Ramen bowl (Student staple food)
 */
export const PixelRamen: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    {/* Steam */}
    <rect x="5" y="1" width="1" height="2" fill="#B8A5FF" />
    <rect x="8" y="0" width="1" height="2" fill="#B8A5FF" />
    <rect x="11" y="1" width="1" height="2" fill="#B8A5FF" />
    {/* Chopsticks */}
    <rect x="3" y="4" width="11" height="1" fill="#F5F0DF" />
    {/* Bowl top rim */}
    <rect x="2" y="6" width="12" height="2" fill="#FF657A" />
    {/* Noodles */}
    <rect x="3" y="7" width="10" height="2" fill="#FFC857" />
    <rect x="6" y="7" width="2" height="2" fill="#C8FF70" />
    {/* Bowl body */}
    <rect x="3" y="8" width="10" height="5" fill="#20243A" />
    <rect x="4" y="9" width="8" height="3" fill="#3B4268" />
    {/* Base */}
    <rect x="5" y="13" width="6" height="2" fill="#FF657A" />
  </svg>
);

/**
 * Pixel Coffee cup
 */
export const PixelCoffee: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    <rect x="5" y="1" width="1" height="2" fill="#B8A5FF" />
    <rect x="9" y="1" width="1" height="2" fill="#B8A5FF" />
    {/* Cup Lid */}
    <rect x="4" y="3" width="8" height="2" fill="#F5F0DF" />
    {/* Cup Body */}
    <rect x="4" y="5" width="8" height="9" fill="#FFC857" />
    <rect x="5" y="7" width="6" height="4" fill="#3B4268" />
    <rect x="7" y="8" width="2" height="2" fill="#C8FF70" />
    {/* Cup Bottom */}
    <rect x="5" y="14" width="6" height="1" fill="#B8A5FF" />
  </svg>
);

/**
 * Pixel Skull for zero balance / emotional damage
 */
export const PixelSkull: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    <rect x="4" y="2" width="8" height="8" fill="#FF657A" />
    <rect x="3" y="4" width="10" height="5" fill="#FF657A" />
    {/* Eyes */}
    <rect x="5" y="6" width="2" height="2" fill="#111522" />
    <rect x="9" y="6" width="2" height="2" fill="#111522" />
    {/* Nose */}
    <rect x="7" y="8" width="2" height="1" fill="#111522" />
    {/* Teeth */}
    <rect x="5" y="11" width="6" height="3" fill="#F5F0DF" />
    <rect x="6" y="12" width="1" height="2" fill="#111522" />
    <rect x="8" y="12" width="1" height="2" fill="#111522" />
    <rect x="10" y="12" width="1" height="2" fill="#111522" />
  </svg>
);

/**
 * Pixel Heart for health / life
 */
export const PixelHeart: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    shapeRendering="crispEdges"
  >
    <rect x="3" y="3" width="4" height="4" fill="#FF657A" />
    <rect x="9" y="3" width="4" height="4" fill="#FF657A" />
    <rect x="2" y="4" width="12" height="4" fill="#FF657A" />
    <rect x="3" y="8" width="10" height="2" fill="#FF657A" />
    <rect x="5" y="10" width="6" height="2" fill="#FF657A" />
    <rect x="7" y="12" width="2" height="2" fill="#FF657A" />
    {/* Shine */}
    <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

