import { TextInput, StyleSheet } from 'react-native';
import { theme } from '../constants/Theme';

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#9CA3AF"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    fontSize: 16,
    marginBottom: theme.spacing.md
  }
});