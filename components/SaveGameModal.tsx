import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/Theme';
import { Button } from '@/components/Button';
import { useState } from 'react';

type SaveGameModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export function SaveGameModal({ visible, onClose, onSave }: SaveGameModalProps) {
  const [saveName, setSaveName] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Save Game</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter save name"
            value={saveName}
            onChangeText={setSaveName}
          />
          <View style={styles.buttons}>
            <Button 
              title="Cancel" 
              onPress={onClose} 
              variant="secondary" 
            />
            <Button 
              title="Save" 
              onPress={() => {
                onSave(saveName);
                setSaveName('');
              }}
              disabled={!saveName}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    modal: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: theme.spacing.lg,
      color: theme.colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing.md,
    },
    saveItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    saveName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    saveDate: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
    },
});