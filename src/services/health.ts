// Mock health service for testing - replace with actual HealthKit integration
import { supabase } from './supabase';
import { XP_RATES, ANTI_CHEAT, DAILY_MILESTONES } from '../constants/game';
import { ActivityType, WorkoutData } from '../types';

export class HealthService {
  static async requestPermissions(): Promise<boolean> {
    // Mock - always return true for testing
    console.log('Health permissions requested (mock)');
    return true;
  }

  static async syncDailyData(userId: string, date: Date = new Date()): Promise<number> {
    // Mock data for testing
    const steps = Math.floor(Math.random() * 10000) + 5000;
    const calories = Math.floor(Math.random() * 500) + 250;
    const distance = steps * 0.0008; // ~0.8m per step

    const workouts: WorkoutData[] = [];

    // Calculate XP
    const baseXP = (steps * XP_RATES.STEPS) + (calories * XP_RATES.CALORIES);
    const totalXP = Math.min(Math.floor(baseXP), ANTI_CHEAT.MAX_XP_PER_SYNC);

    const milestoneRewards = this.calculateMilestoneRewards(steps, calories);

    // Save to database
    const { error } = await supabase.from('health_syncs').upsert({
      user_id: userId,
      date: date.toISOString().split('T')[0],
      steps,
      calories,
      distance,
      active_minutes: 30,
      workouts,
      xp_earned: totalXP + milestoneRewards.xp,
      synced_at: new Date().toISOString(),
    });

    if (error) throw error;

    await this.updateUserProgress(userId, totalXP + milestoneRewards.xp, milestoneRewards.sweatPoints);

    return totalXP + milestoneRewards.xp;
  }

  private static calculateMilestoneRewards(steps: number, calories: number): { xp: number; sweatPoints: number } {
    let totalXP = 0;
    let totalSweatPoints = 0;

    DAILY_MILESTONES.forEach(milestone => {
      if (milestone.steps && steps >= milestone.steps) {
        totalXP += milestone.reward_xp;
        totalSweatPoints += milestone.reward_sweat_points;
      }
      if (milestone.calories && calories >= milestone.calories) {
        totalXP += milestone.reward_xp;
        totalSweatPoints += milestone.reward_sweat_points;
      }
    });

    return { xp: totalXP, sweatPoints: totalSweatPoints };
  }

  private static async updateUserProgress(userId: string, xp: number, sweatPoints: number): Promise<void> {
    const { data: user } = await supabase.from('users').select('xp, sweat_points, level, subscription_tier').eq('id', userId).single();
    
    if (!user) return;

    const multiplier = user.subscription_tier === 'premium' ? 2 : 1;
    const newXP = user.xp + xp;
    const newSweatPoints = user.sweat_points + (sweatPoints * multiplier);

    let newLevel = user.level;
    let requiredXP = this.calculateXPForLevel(newLevel);
    while (newXP >= requiredXP) {
      newLevel++;
      requiredXP = this.calculateXPForLevel(newLevel);
    }

    await supabase.from('users').update({
      xp: newXP,
      sweat_points: newSweatPoints,
      level: newLevel,
    }).eq('id', userId);
  }

  private static calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
