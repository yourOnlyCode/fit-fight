// Core Types
export type UserClass = 'sprinter' | 'tank' | 'trickster' | 'endurance';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable';

export type StatusEffect = 'slow' | 'stun' | 'speed_boost' | 'shield' | 'poison' | 'invincible';

export type ActivityType = 'steps' | 'running' | 'cycling' | 'swimming' | 'workout';

export type SubscriptionTier = 'free' | 'premium';

// Database Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  class: UserClass;
  level: number;
  xp: number;
  sweat_points: number;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  skin_color: string;
  hair_style: string;
  hair_color: string;
  outfit: string;
  accessories: string[];
  rive_state: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  stats: ItemStats;
  price_sweat_points?: number;
  price_real?: number;
  image_url: string;
  created_at: string;
}

export interface ItemStats {
  speed?: number;
  defense?: number;
  attack?: number;
  stamina?: number;
  ability_cooldown_reduction?: number;
}

export interface Inventory {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  is_equipped: boolean;
  acquired_at: string;
}

export interface SkillTree {
  id: string;
  class: UserClass;
  nodes: SkillNode[];
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number;
  position: { x: number; y: number };
  requirements: string[];
  cost: number;
  ability?: Ability;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: AbilityEffect;
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'status' | 'buff' | 'debuff';
  value: number;
  status_effect?: StatusEffect;
  duration?: number;
  target: 'self' | 'opponent';
}

export interface UserSkills {
  id: string;
  user_id: string;
  unlocked_nodes: string[];
  active_abilities: string[];
  updated_at: string;
}

export interface Battle {
  id: string;
  challenger_id: string;
  opponent_id: string;
  winner_id?: string;
  battle_data: BattleData;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  completed_at?: string;
}

export interface BattleData {
  track_length: number;
  challenger_position: number;
  opponent_position: number;
  challenger_actions: BattleAction[];
  opponent_actions: BattleAction[];
  turn: number;
}

export interface BattleAction {
  turn: number;
  ability_id?: string;
  move_distance: number;
  status_effects_applied: StatusEffect[];
  timestamp: string;
}

export interface RunClub {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  max_members: number;
  is_private: boolean;
  image_url?: string;
  created_at: string;
}

export interface RunClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: ActivityType | 'battle' | 'social';
  target_value: number;
  reward_xp: number;
  reward_sweat_points: number;
  active_date: string;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: AchievementRequirement;
  reward_xp: number;
  reward_sweat_points: number;
}

export interface AchievementRequirement {
  type: 'total_steps' | 'total_battles' | 'win_streak' | 'level' | 'club_members';
  value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface HealthSync {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  calories: number;
  distance: number;
  active_minutes: number;
  workouts: WorkoutData[];
  xp_earned: number;
  synced_at: string;
}

export interface WorkoutData {
  type: ActivityType;
  duration: number;
  calories: number;
  distance?: number;
  start_time: string;
  end_time: string;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'friends' | 'club';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  score: number;
  rank: number;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'battle_invite' | 'club_invite' | 'friend_request' | 'achievement' | 'quest_complete';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}
