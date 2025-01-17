import { Tabs } from 'expo-router';
import { theme } from '@/constants/Theme';
import { Image, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Tabs screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            headerShown: false
          }}>
            <Tabs.Screen
              name="learn"
              options={{
                title: 'Learn',
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('@/assets/images/learn.svg')}
                    style={{
                      width: 28,
                      height: 24,
                      tintColor: color
                    }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="lab/index"
              options={{
                title: 'Lab',
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('@/assets/images/lab.svg')}
                    style={{
                      width: 30,
                      height: 24,
                      tintColor: color
                    }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('@/assets/images/profile.svg')}
                    style={{
                      width: 21,
                      height: 24,
                      tintColor: color
                    }}
                  />
                ),
              }}
            />
          </Tabs>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 768,
  },
});