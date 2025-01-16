import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { modules } from '@/data/modules';
import { Button } from '@/components/Button';
import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { FormattedText } from '@/components/FormattedText';
import { ContentSection } from '@/types/module';
import { updateProgress, getModuleProgress } from '@/lib/progress';
import { useEffect, useState } from 'react';

export default function ModulePage() {
  const { moduleId, pageIndex } = useLocalSearchParams<{
    moduleId: string;
    pageIndex: string;
  }>();

  const module = modules.find(m => m.id === moduleId);
  const currentPageIndex = parseInt(pageIndex);
  const currentPage = module?.pages[currentPageIndex];
  const isLastPage = currentPageIndex === (module?.pages.length ?? 0) - 1;
  const [progress, setProgress] = useState<any>(null);

  // Fetch progress on mount
  useEffect(() => {
    async function fetchProgress() {
      if (moduleId) {
        const progress = await getModuleProgress(moduleId);
        setProgress(progress);
      }
    }
    fetchProgress();
  }, [moduleId]);

  // Update progress when page changes
  useEffect(() => {
    if (moduleId) {
      updateProgress(moduleId, currentPageIndex);
    }
  }, [moduleId, currentPageIndex]);

  const handleComplete = async () => {
    if (moduleId) {
      await updateProgress(moduleId, currentPageIndex, true);
    }
    router.replace('/learn');
  };
  
  // Update progress bar calculation
  const progressPercentage = Math.round(((currentPageIndex + 1) / (module?.pages.length || 1)) * 100);

  if (!module || !currentPage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Module or page not found</Text>
      </View>
    );
  }

  const hasNextPage = currentPageIndex < module.pages.length - 1;
  const hasPrevPage = currentPageIndex > 0;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
      <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer} // Add this
        >
          <View style={styles.progressCard}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Lesson {currentPageIndex + 1} of {module.pages.length}
            </Text>
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.pageTitle}>{currentPage.title}</Text>
            
            {Array.isArray(currentPage.content) ? (
              currentPage.content.map((section: ContentSection, index: number) => (
                <View key={index} style={styles.section}>
                  {section.type === 'paragraph' && (
                    <FormattedText content={section.content as string} />
                  )}
                  {section.type === 'list' && (
                    <View style={styles.list}>
                      {(section.content as string[]).map((item: string, i: number) => (
                        <View key={i} style={styles.listItem}>
                          <Text style={styles.bullet}>•</Text>
                          <FormattedText content={item} />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <FormattedText content={currentPage.content as string} />
            )}
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          {hasPrevPage && (
            <Button 
              title="Previous"
              variant="secondary"
              onPress={() => router.push(`/learn/(module)/${moduleId}/${currentPageIndex - 1}`)}
              icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
            />
          )}
          <View style={styles.spacer} />
          {isLastPage ? (
            <Button 
              title="Complete"
              onPress={handleComplete}
              icon={<Ionicons name="checkmark" size={20} color="white" />}
              iconPosition="right"
            />
          ) : (
            <Button 
              title="Next"
              onPress={() => router.push(`/learn/(module)/${moduleId}/${currentPageIndex + 1}`)}
              icon={<Ionicons name="arrow-forward" size={20} color="white" />}
              iconPosition="right"
            />
          )}
        </View>
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
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    paddingBottom: 60, // Space for navigation
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: 80, // Add extra padding for navigation buttons
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleTitle: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  contentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  pageContent: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.md, 
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: theme.colors.surface,
    justifyContent: 'space-between', // Space buttons apart
    alignItems: 'center', // Center vertically
    position: 'absolute', // Fix position
    bottom: 0, // Stick to bottom
    left: 0,
    right: 0,
    height: 60,
  },
  spacer: {
    width: theme.spacing.md,
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  list: {
    marginLeft: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  bullet: {
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
  }
});