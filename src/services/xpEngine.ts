export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  xpNeededForNext: number;
  progressPercent: number;
  title: string;
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Frugal Fresher',
  2: 'Hostel Scavenger',
  3: 'Kettle Chef',
  4: 'Discount Ninja',
  5: 'Budge-it Master',
  6: 'Tapri Diplomat',
  7: 'Financial Wizard',
  8: 'Campus Economic Guru',
  9: 'Allowance Architect',
  10: 'Legendary Broke Prodigy',
};

/**
 * Total XP required to reach a specific level.
 * Level 1: 0
 * Level 2: 100
 * Level 3: 250 (+150)
 * Level 4: 450 (+200)
 * Level 5: 700 (+250)
 */
export function getTotalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += 50 + i * 50;
  }
  return total;
}

export function calculateLevelInfo(totalXp: number): LevelInfo {
  let level = 1;

  while (totalXp >= getTotalXpForLevel(level + 1)) {
    level++;
  }

  const currentLevelFloor = getTotalXpForLevel(level);
  const nextLevelFloor = getTotalXpForLevel(level + 1);
  const xpNeeded = nextLevelFloor - currentLevelFloor;
  const currentXpInLevel = Math.max(0, totalXp - currentLevelFloor);
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / xpNeeded) * 100));

  const title = LEVEL_TITLES[level] || LEVEL_TITLES[10];

  return {
    level,
    currentLevelXp: currentXpInLevel,
    xpNeededForNext: xpNeeded,
    progressPercent,
    title,
  };
}

