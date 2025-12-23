import { UserClass } from '../types';

// XP Conversion Rates
export const XP_RATES = {
  STEPS: 1, // 1 step = 1 XP
  CALORIES: 5, // 1 calorie = 5 XP
  RUNNING_MULTIPLIER: 1.5,
  CYCLING_MULTIPLIER: 1.3,
  SWIMMING_MULTIPLIER: 1.8,
  WORKOUT_MULTIPLIER: 1.2,
};

// Daily Milestones
export const DAILY_MILESTONES = [
  { steps: 5000, reward_xp: 500, reward_sweat_points: 50 },
  { steps: 10000, reward_xp: 1000, reward_sweat_points: 100 },
  { steps: 15000, reward_xp: 2000, reward_sweat_points: 200 },
  { calories: 250, reward_xp: 750, reward_sweat_points: 75 },
  { calories: 500, reward_xp: 1500, reward_sweat_points: 150 },
  { calories: 1000, reward_xp: 3000, reward_sweat_points: 300 },
];

// Level Progression (exponential growth)
export const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Run Club Limits
export const RUN_CLUB_LIMITS = {
  FREE: 4,
  PREMIUM: 50,
};

// Battle Configuration
export const BATTLE_CONFIG = {
  TRACK_LENGTH: 1000,
  BASE_MOVE_SPEED: 50,
  TURN_DURATION: 30000, // 30 seconds per turn
  MAX_TURNS: 20,
};

// Class Base Stats
export const CLASS_STATS: Record<UserClass, { speed: number; defense: number; attack: number; stamina: number }> = {
  sprinter: { speed: 100, defense: 60, attack: 80, stamina: 70 },
  tank: { speed: 60, defense: 100, attack: 70, stamina: 90 },
  trickster: { speed: 85, defense: 65, attack: 90, stamina: 65 },
  endurance: { speed: 75, defense: 80, attack: 70, stamina: 100 },
};

// Class Abilities
export const CLASS_ABILITIES = {
  sprinter: [
    { id: 'dash', name: 'Dash', cooldown: 3, effect: { type: 'buff', value: 50, target: 'self' } },
    { id: 'sonic_boom', name: 'Sonic Boom', cooldown: 5, effect: { type: 'damage', value: 30, target: 'opponent' } },
  ],
  tank: [
    { id: 'shield_wall', name: 'Shield Wall', cooldown: 4, effect: { type: 'buff', value: 40, target: 'self' } },
    { id: 'ground_slam', name: 'Ground Slam', cooldown: 5, effect: { type: 'status', value: 20, status_effect: 'stun', duration: 2, target: 'opponent' } },
  ],
  trickster: [
    { id: 'smoke_bomb', name: 'Smoke Bomb', cooldown: 3, effect: { type: 'status', value: 0, status_effect: 'slow', duration: 3, target: 'opponent' } },
    { id: 'poison_dart', name: 'Poison Dart', cooldown: 4, effect: { type: 'status', value: 15, status_effect: 'poison', duration: 4, target: 'opponent' } },
  ],
  endurance: [
    { id: 'second_wind', name: 'Second Wind', cooldown: 5, effect: { type: 'heal', value: 50, target: 'self' } },
    { id: 'steady_pace', name: 'Steady Pace', cooldown: 3, effect: { type: 'buff', value: 30, target: 'self' } },
  ],
};

// Item Rarity Multipliers
export const RARITY_MULTIPLIERS = {
  common: 1,
  rare: 1.5,
  epic: 2,
  legendary: 3,
};

// Subscription Benefits
export const SUBSCRIPTION_BENEFITS = {
  FREE: {
    sweat_points_multiplier: 1,
    max_run_club_size: 4,
    daily_quest_slots: 3,
  },
  PREMIUM: {
    sweat_points_multiplier: 2,
    max_run_club_size: 50,
    daily_quest_slots: 5,
    exclusive_items: true,
  },
};

// Anti-cheat limits
export const ANTI_CHEAT = {
  MAX_STEPS_PER_DAY: 50000,
  MAX_CALORIES_PER_DAY: 5000,
  MAX_XP_PER_SYNC: 100000,
};
