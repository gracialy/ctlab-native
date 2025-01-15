import { Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/Theme';

export function FormattedText({ content }: { content: string }) {
  // Add type check and conversion
  const textContent = String(content || '');
  const parts = textContent.split(/(\*\*.*?\*\*)/g);
  
  return (
    <Text style={styles.text}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  bold: {
    fontWeight: 'bold'
  }
});