import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { theme } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { modules } from '@/data/modules';
import { loadGameState } from '@/lib/game';

export type Activity = {
  id?: string;
  type: 'learn' | 'lab';
  module_id?: string;
  save_name?: string;
  score?: number;
  last_access_time: string;
};

type LabHistory = {
  score: number;
  saved_at: string;
};

export default function Profile() {
  const { signOut } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [labHistory, setLabHistory] = useState<LabHistory[]>([]);

  const handleActivityPress = (moduleId: string, pageIndex: number) => {
    router.push(`/learn/(module)/${moduleId}/${pageIndex}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');

        // Fetch learn activities
        const { data: learnActivities } = await supabase
          .from('module_progress')
          .select('module_id, last_access_time')
          .order('last_access_time', { ascending: false });

        // Fetch lab activities
        const { data: labActivities } = await supabase
          .from('game_states')
          .select('id, save_name, score, saved_at')
          .order('saved_at', { ascending: false });

        // Combine and format activities
        const allActivities: Activity[] = [
          ...(learnActivities?.map(a => ({
            type: 'learn' as const,
            module_id: a.module_id,
            last_access_time: a.last_access_time,
          })) || []),
          ...(labActivities?.map(a => ({
            type: 'lab' as const,
            id: a.id,
            save_name: a.save_name,
            score: a.score,
            last_access_time: a.saved_at,
          })) || []),
        ].sort((a, b) =>
          new Date(b.last_access_time).getTime() - new Date(a.last_access_time).getTime()
        ).slice(0, 5);

        setActivities(allActivities);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    async function fetchLabHistory() {
      const { data } = await supabase
        .from('game_states')
        .select('score, saved_at, id')
        .order('saved_at', { ascending: false })
        .limit(5);

      if (data) setLabHistory(data);
    }

    fetchLabHistory();
  }, []);

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={require('@/assets/images/profile.svg')}
                style={{
                  width: 33,
                  height: 40,
                  tintColor: 'white'
                }}
              />
            </View>
          </View>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.map((activity, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.activityCard,
                pressed && styles.activityCardPressed
              ]}
              onPress={() => {
                if (activity.type === 'learn' && activity.module_id) {
                  router.push(`/learn/(module)/${activity.module_id}/0`);
                } else if (activity.type === 'lab' && activity.id) { // Change save_name to id
                  router.push('/lab');
                }
              }}
            >
              <View style={styles.activityIcon}>
                {activity.type === 'learn' ? (
                  <Image
                    source={require('@/assets/images/learn.svg')}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: theme.colors.primary
                    }}
                  />
                ) : (
                  <Image
                    source={require('@/assets/images/lab.svg')}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: theme.colors.primary
                    }}
                  />
                )}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.type === 'learn'
                    ? `Accessed ${modules.find(m => m.id === activity.module_id)?.title || activity.module_id}`
                    : `Played Lab - ${activity.save_name} (Score: ${activity.score})`
                  }
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.last_access_time).toLocaleDateString()}
                </Text>
              </View>
              {activity.type === 'learn' && (
                <Image
                  source={require('@/assets/images/arrow-right.svg')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#6B7280'
                  }}
                />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.graphSection}>
          <View style={styles.graphHeader}>
            <Text style={styles.sectionTitle}>Lab Performance</Text>
            {/* <Text style={styles.graphSubtitle}>Recent games</Text> */}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScrollContent}
          >
            <View style={styles.chartContainer}>
              {labHistory.map((history, index) => {
                const normalizedHeight = (history.score / Math.max(...labHistory.map(h => h.score))) * 150;
                return (
                  <View key={index} style={styles.barContainer}>
                    <Text style={styles.scoreLabel}>{history.score}</Text>
                    <View style={[
                      styles.bar,
                      { height: Math.max(normalizedHeight, 20) }
                    ]}>
                      <View style={styles.barGradient} />
                    </View>
                    <Text style={styles.barLabel}>
                      {new Date(history.saved_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Score</Text>
              <Text style={styles.statValue}>
                {Math.round(labHistory.reduce((acc, curr) => acc + curr.score, 0) / labHistory.length)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Best Score</Text>
              <Text style={styles.statValue}>
                {Math.max(...labHistory.map(h => h.score))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Image
              source={require('@/assets/images/log-out.svg')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme.colors.error
              }}
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 768, // Maximum width for larger screens
    alignSelf: 'center', // Center horizontally
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  activitySection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityCardPressed: {
    opacity: 0.7,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
  },
  activityItemPressed: {
    opacity: 0.7,
  },
  activityArrow: {
    marginLeft: 'auto',
  },
  graphSection: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },
  graphSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartScrollContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 280,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.xl * 2,
  },
  barContainer: {
    alignItems: 'center',
    width: 48,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 48,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  barGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.colors.primary,
    opacity: 0.9,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  scoreLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  actionSection: {
    padding: theme.spacing.xl,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.error,
    gap: theme.spacing.sm,
  },
  signOutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});