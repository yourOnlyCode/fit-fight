import { calculateXPForLevel } from '../constants/game';

export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (xp >= calculateXPForLevel(level)) {
    level++;
  }
  return level - 1;
};

export const getXPProgress = (currentXP: number, level: number): { current: number; required: number; percentage: number } => {
  const currentLevelXP = calculateXPForLevel(level);
  const nextLevelXP = calculateXPForLevel(level + 1);
  const xpIntoLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  
  return {
    current: xpIntoLevel,
    required: xpNeeded,
    percentage: (xpIntoLevel / xpNeeded) * 100,
  };
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getClassColor = (userClass: string): string => {
  const colors: Record<string, string> = {
    sprinter: '#00d9ff',
    tank: '#ff6b35',
    trickster: '#9d4edd',
    endurance: '#06ffa5',
  };
  return colors[userClass] || '#ffffff';
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#9e9e9e',
    rare: '#2196f3',
    epic: '#9c27b0',
    legendary: '#ff9800',
  };
  return colors[rarity] || '#ffffff';
};
