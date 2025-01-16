import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { modules } from '@/data/modules';

type ActivityItem = {
  module_id: string;
  last_page_index: number;
  last_access_time: string;
  module_title?: string;
};

export default function Profile() {
  const { signOut } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        
        // Fetch recent activities
        const { data } = await supabase
          .from('module_progress')
          .select('module_id, last_page_index, last_access_time')
          .order('last_access_time', { ascending: false })
          .limit(5);
          
        if (data) {
          // Add module title to activities
          const activitiesWithNames = data.map(activity => ({
            ...activity,
            module_title: modules.find(m => m.id === activity.module_id)?.title
          }));
          setActivities(activitiesWithNames);
        }
      }
    }
    loadProfile();
  }, []);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="white" />
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
            onPress={() => handleActivityPress(activity.module_id, activity.last_page_index)}
          >
            <View style={styles.activityIcon}>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {activity.module_title || activity.module_id}
              </Text>
              <Text style={styles.activityTime}>
                {new Date(activity.last_access_time).toLocaleDateString()}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#6B7280" 
              style={styles.activityArrow}
            />
          </Pressable>
        ))}
      </View>

      <View style={styles.actionSection}>
        <Pressable 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color={theme.colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6',
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