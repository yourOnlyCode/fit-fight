import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/userStore';
import { HealthService } from '../services/health';
import { COLORS, SPACING } from '../constants/theme';
import { formatNumber, getXPProgress } from '../utils/helpers';

export default function HomeScreen() {
  const { user, updateUserXP } = useUserStore();

  useEffect(() => {
    if (user) {
      syncHealthData();
    }
  }, []);

  const syncHealthData = async () => {
    if (!user) return;
    
    const hasPermission = await HealthService.requestPermissions();
    if (hasPermission) {
      const xpEarned = await HealthService.syncDailyData(user.id);
      updateUserXP(xpEarned);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please sign in</Text>
      </View>
    );
  }

  const xpProgress = getXPProgress(user.xp, user.level);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sweat Battle</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{user.level}</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${xpProgress.percentage}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
        </Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Sweat Points</Text>
          <Text style={[styles.statValue, { color: COLORS.accent }]}>
            {formatNumber(user.sweat_points)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.syncButton} onPress={syncHealthData}>
        <Text style={styles.syncButtonText}>Sync Health Data</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Quests</Text>
        <Text style={styles.placeholder}>Coming soon...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Battles</Text>
        <Text style={styles.placeholder}>No active battles</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  username: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  statsCard: {
    backgroundColor: COLORS.backgroundSecondary,
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  xpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  syncButton: {
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  section: {
    margin: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  placeholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
