import { supabase } from '../services/supabase';
import { Battle, BattleAction, BattleData, StatusEffect, User, Ability } from '../types';
import { BATTLE_CONFIG, CLASS_STATS } from '../constants/game';

export class BattleEngine {
  static async createBattle(challengerId: string, opponentId: string): Promise<string> {
    const initialData: BattleData = {
      track_length: BATTLE_CONFIG.TRACK_LENGTH,
      challenger_position: 0,
      opponent_position: 0,
      challenger_actions: [],
      opponent_actions: [],
      turn: 0,
    };

    const { data, error } = await supabase.from('battles').insert({
      challenger_id: challengerId,
      opponent_id: opponentId,
      battle_data: initialData,
      status: 'pending',
    }).select().single();

    if (error) throw error;

    // Send notification to opponent
    await supabase.from('notifications').insert({
      user_id: opponentId,
      type: 'battle_invite',
      title: 'Battle Challenge!',
      message: 'You have been challenged to a battle!',
      data: { battle_id: data.id },
    });

    return data.id;
  }

  static async submitAction(battleId: string, userId: string, abilityId?: string): Promise<void> {
    const { data: battle, error } = await supabase.from('battles').select('*').eq('id', battleId).single();
    if (error || !battle) throw new Error('Battle not found');

    const isChallenger = battle.challenger_id === userId;
    const battleData: BattleData = battle.battle_data;

    // Get user stats and abilities
    const { data: user } = await supabase.from('users').select('*, user_skills(*)').eq('id', userId).single();
    if (!user) throw new Error('User not found');

    const { data: inventory } = await supabase.from('inventory').select('*, items(*)').eq('user_id', userId).eq('is_equipped', true);
    
    // Calculate total stats
    const baseStats = CLASS_STATS[user.class];
    const itemStats = this.calculateItemStats(inventory || []);
    const totalStats = {
      speed: baseStats.speed + itemStats.speed,
      defense: baseStats.defense + itemStats.defense,
      attack: baseStats.attack + itemStats.attack,
      stamina: baseStats.stamina + itemStats.stamina,
    };

    // Calculate move distance
    let moveDistance = BATTLE_CONFIG.BASE_MOVE_SPEED + (totalStats.speed * 0.5);
    const statusEffects: StatusEffect[] = [];

    // Apply ability effects
    if (abilityId) {
      const ability = this.getAbility(user.class, abilityId);
      if (ability) {
        const { effect } = ability;
        
        if (effect.type === 'buff' && effect.target === 'self') {
          moveDistance += effect.value;
        } else if (effect.type === 'status' && effect.target === 'opponent' && effect.status_effect) {
          statusEffects.push(effect.status_effect);
        }
      }
    }

    // Create action
    const action: BattleAction = {
      turn: battleData.turn,
      ability_id: abilityId,
      move_distance: moveDistance,
      status_effects_applied: statusEffects,
      timestamp: new Date().toISOString(),
    };

    // Update battle data
    if (isChallenger) {
      battleData.challenger_actions.push(action);
      battleData.challenger_position += moveDistance;
    } else {
      battleData.opponent_actions.push(action);
      battleData.opponent_position += moveDistance;
    }

    // Check if both players have acted this turn
    const challengerActed = battleData.challenger_actions.some(a => a.turn === battleData.turn);
    const opponentActed = battleData.opponent_actions.some(a => a.turn === battleData.turn);

    if (challengerActed && opponentActed) {
      battleData.turn++;
    }

    // Check win condition
    let winnerId = null;
    let status = battle.status;

    if (battleData.challenger_position >= BATTLE_CONFIG.TRACK_LENGTH) {
      winnerId = battle.challenger_id;
      status = 'completed';
    } else if (battleData.opponent_position >= BATTLE_CONFIG.TRACK_LENGTH) {
      winnerId = battle.opponent_id;
      status = 'completed';
    } else if (battleData.turn >= BATTLE_CONFIG.MAX_TURNS) {
      // Timeout - winner is whoever is furthest
      winnerId = battleData.challenger_position > battleData.opponent_position 
        ? battle.challenger_id 
        : battle.opponent_id;
      status = 'completed';
    }

    // Update battle
    await supabase.from('battles').update({
      battle_data: battleData,
      winner_id: winnerId,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    }).eq('id', battleId);

    // Award rewards if battle completed
    if (status === 'completed' && winnerId) {
      await this.awardBattleRewards(winnerId, battleId);
    }
  }

  private static calculateItemStats(inventory: any[]): { speed: number; defense: number; attack: number; stamina: number } {
    return inventory.reduce((total, item) => {
      const stats = item.items.stats;
      return {
        speed: total.speed + (stats.speed || 0),
        defense: total.defense + (stats.defense || 0),
        attack: total.attack + (stats.attack || 0),
        stamina: total.stamina + (stats.stamina || 0),
      };
    }, { speed: 0, defense: 0, attack: 0, stamina: 0 });
  }

  private static getAbility(userClass: string, abilityId: string): Ability | null {
    // This would fetch from skill tree, simplified for now
    return null;
  }

  private static async awardBattleRewards(winnerId: string, battleId: string): Promise<void> {
    const xpReward = 500;
    const sweatPointsReward = 50;

    const { data: user } = await supabase.from('users').select('xp, sweat_points').eq('id', winnerId).single();
    if (!user) return;

    await supabase.from('users').update({
      xp: user.xp + xpReward,
      sweat_points: user.sweat_points + sweatPointsReward,
    }).eq('id', winnerId);

    // Send notification
    await supabase.from('notifications').insert({
      user_id: winnerId,
      type: 'achievement',
      title: 'Victory!',
      message: `You won the battle! +${xpReward} XP, +${sweatPointsReward} Sweat Points`,
      data: { battle_id: battleId },
    });
  }

  static async getBattleState(battleId: string): Promise<Battle | null> {
    const { data, error } = await supabase.from('battles').select('*').eq('id', battleId).single();
    if (error) return null;
    return data;
  }
}
