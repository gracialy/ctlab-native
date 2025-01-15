import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { theme } from '@/constants/Theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
  iconPosition?: 'left' | 'right';
};

export function Button({ 
  title, 
  onPress, 
  icon,
  variant = 'primary',
  disabled = false,
  style,
  iconPosition = 'left'
}: ButtonProps) {
  return (
    <Pressable 
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      {iconPosition === 'left' && icon}
      {title && (
        <Text style={[
          styles.buttonText,
          variant === 'secondary' && styles.buttonTextSecondary,
          disabled && styles.buttonTextDisabled
        ]}>
          {title}
        </Text>
      )}
      {iconPosition === 'right' && icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    height: 36,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextSecondary: {
    color: theme.colors.primary
  },
  buttonTextDisabled: {
    color: '#9CA3AF'
  },
  iconLeft: {
    marginRight: theme.spacing.sm
  },
  iconRight: {
    marginLeft: theme.spacing.sm
  }
});