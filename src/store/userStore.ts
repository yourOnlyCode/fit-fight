import { create } from 'zustand';
import { User, Character, Inventory, Battle, Notification } from '../types';
import { supabase } from '../services/supabase';

interface UserStore {
  user: User | null;
  character: Character | null;
  inventory: Inventory[];
  activeBattles: Battle[];
  notifications: Notification[];
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setCharacter: (character: Character | null) => void;
  loadUserData: (userId: string) => Promise<void>;
  updateUserXP: (xp: number) => void;
  updateSweatPoints: (points: number) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  character: null,
  inventory: [],
  activeBattles: [],
  notifications: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  
  setCharacter: (character) => set({ character }),

  loadUserData: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Load user
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
      
      // Load character
      const { data: character } = await supabase.from('characters').select('*').eq('user_id', userId).single();
      
      // Load inventory
      const { data: inventory } = await supabase.from('inventory').select('*, items(*)').eq('user_id', userId);
      
      // Load active battles
      const { data: battles } = await supabase
        .from('battles')
        .select('*')
        .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
        .eq('status', 'active');
      
      // Load notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(20);

      set({
        user: user || null,
        character: character || null,
        inventory: inventory || [],
        activeBattles: battles || [],
        notifications: notifications || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      set({ isLoading: false });
    }
  },

  updateUserXP: (xp: number) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, xp: user.xp + xp } });
    }
  },

  updateSweatPoints: (points: number) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, sweat_points: user.sweat_points + points } });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  markNotificationRead: async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      character: null,
      inventory: [],
      activeBattles: [],
      notifications: [],
    });
  },
}));
