import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/Theme';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signInWithEmail() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.replace('/(tabs)/lab');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
      <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <Button 
            title={loading ? "Signing in..." : "Sign In"}
            onPress={signInWithEmail}
            disabled={loading}
          />
          <Button 
            title="Create Account"
            variant="secondary"
            onPress={() => router.push('/signup')}
            disabled={loading}
          />
          {loading && (
          <ActivityIndicator 
            color={theme.colors.primary} 
            style={styles.loader}
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
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 768,
    alignSelf: 'center',
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  loader: {
    marginTop: theme.spacing.md
  },
  buttonContainer: {
    gap: theme.spacing.md, // Add spacing between buttons
    marginTop: theme.spacing.lg, // Add top margin
  },
});