import React from 'react';
import { PixelStudent, PixelWallet, PixelRamen, PixelCoffee } from '../common/PixelArtIcons';

interface CampusEnvironmentProps {
  simulatedDay: number;
  gameBalancePaise: number;
  dailySpentPaise: number;
  streak: number;
}

export const CampusEnvironment: React.FC<CampusEnvironmentProps> = ({
  simulatedDay,
  gameBalancePaise,
  dailySpentPaise,
}) => {
  const isNegative = gameBalancePaise < 0;

  return (
    <div className="relative w-full bg-gradient-to-b from-[#181D33] via-[#141829] to-[#0D101C] border-4 border-retro-border shadow-pixel-lg overflow-hidden p-4 sm:p-6 min-h-[220px]">
      {/* 16-Bit Background Elements: Window, Wall Calendar, Hostel Poster */}
      <div className="absolute top-3 left-4 flex items-start gap-4 opacity-90">
        {/* Hostel Dorm Window with Pixel Skyline */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1B264F] border-2 border-retro-border p-1 relative shadow-inner overflow-hidden">
          {/* Night Sky with stars */}
          <div className="absolute inset-0 bg-[#0B0F26]">
            <div className="absolute top-2 left-3 w-1 h-1 bg-white animate-pulse" />
            <div className="absolute top-6 right-4 w-1 h-1 bg-amber" />
            <div className="absolute top-10 left-8 w-1 h-1 bg-neon-lime" />
            {/* Campus Clock Tower Silhouettes */}
            <div className="absolute bottom-0 left-2 w-5 h-12 bg-[#1B264F] border-t-2 border-[#2C3E82]" />
            <div className="absolute bottom-0 right-3 w-7 h-16 bg-[#162145] border-t-2 border-[#2C3E82]" />
            {/* Window Grid Frame */}
            <div className="absolute inset-0 border-2 border-[#3B4268] pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#3B4268]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#3B4268]" />
          </div>
        </div>

        {/* Wall Poster / Calendar */}
        <div className="hidden xs:block bg-retro-panel border-2 border-retro-border p-2 shadow-pixel-sm text-center w-20">
          <p className="font-pixel text-[8px] text-danger-red uppercase border-b border-retro-border pb-1">
            SEMESTER
          </p>
          <p className="font-pixel text-base text-cream mt-1">
            {simulatedDay}
          </p>
          <p className="font-mono text-[9px] text-cream-muted uppercase">
            DAY
          </p>
        </div>
      </div>

      {/* Center/Right: Desk, Student Sprite, and Kettle */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-8 pt-8 sm:pt-4">
        {/* Student Thought Bubble */}
        <div className="relative bg-retro-dark border-2 border-retro-border px-3 py-2 shadow-pixel-sm text-center max-w-[220px]">
          <p className="font-mono text-xs text-cream">
            {isNegative
              ? '💀 "Can I pay semester fees in vibes?"'
              : dailySpentPaise === 0
              ? '🍜 "So far, zero rupee spent. I am invincible."'
              : '🎒 "Resisting the iced coffee was a battle."'}
          </p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 right-8 w-2 h-2 bg-retro-dark border-r-2 border-b-2 border-retro-border rotate-45" />
        </div>

        {/* Student at Study Desk */}
        <div className="flex items-end gap-3">
          <div className="relative flex flex-col items-center">
            <PixelStudent className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />
            {/* Shadow under student */}
            <div className="w-12 h-2 bg-black/60 rounded-full blur-[1px] mt-0.5" />
          </div>

          {/* Dorm Study Desk Setup */}
          <div className="bg-[#262D4A] border-t-4 border-l-2 border-r-2 border-[#3B4268] p-2 flex items-center gap-2 shadow-pixel">
            <PixelCoffee className="w-6 h-6" />
            <div className="w-8 h-5 bg-[#111522] border border-retro-border flex items-center justify-center">
              <span className="font-mono text-[9px] text-neon-lime">&lt;/&gt;</span>
            </div>
            <PixelRamen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Floating Ambient Tokens */}
      <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-retro-dark/80 px-2.5 py-1 border border-retro-border text-xs font-mono">
        <PixelWallet className="w-4 h-4" />
        <span className="text-cream-muted font-bold">Hostel Block B, Room 204</span>
      </div>
    </div>
  );
};
