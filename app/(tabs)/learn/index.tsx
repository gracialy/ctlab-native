import { View, Text, FlatList, Pressable, StyleSheet, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { modules } from '@/data/modules';
import { theme } from '@/constants/Theme';
import { useEffect, useState } from 'react';
import { getModuleProgress } from '@/lib/progress';
import type { ModuleProgress } from '@/types/progress';

export default function LearnIndex() {
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchAllProgress() {
      const progress: Record<string, ModuleProgress | null> = {};
      for (const module of modules) {
        progress[module.id] = await getModuleProgress(module.id);
      }
      setProgressMap(progress);
    }
    fetchAllProgress();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Modules</Text>
        <FlatList
          data={modules}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.moduleCard,
                pressed && styles.moduleCardPressed
              ]}
              onPress={async () => {
                const progress = await getModuleProgress(item.id);
                const lastPage = progress?.last_page_index || 0;
                router.push(`/learn/(module)/${item.id}/${lastPage}`);
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('@/assets/images/learn.svg')}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: theme.colors.primary
                    }}
                  />
                </View>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {progressMap[item.id]?.completed_at
                      ? `${item.pages.length}/${item.pages.length} completed`
                      : `${(progressMap[item.id]?.last_page_index || 0) + 1}/${item.pages.length} completed`
                    }
                  </Text>

                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      {
                        width: progressMap[item.id]?.completed_at
                          ? '100%'
                          : `${(((progressMap[item.id]?.last_page_index || 0) + 1) / item.pages.length) * 100}%`
                      }
                    ]} />
                  </View>
                </View>
              </View>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.moduleDescription}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.lessonCount}>
                  {item.pages.length} lessons
                </Text>
                <Image
                  source={require('@/assets/images/arrow-right.svg')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: theme.colors.primary
                  }}
                />
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 768,
    alignSelf: 'center',
    flex: 1,
    marginTop: theme.spacing.xl,
  },
  list: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.text,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  moduleCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    width: '0%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lessonCount: {
    fontSize: 14,
    color: '#6B7280',
  }
});