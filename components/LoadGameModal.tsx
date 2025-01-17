import { Modal, View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { theme } from '@/constants/Theme';
import { Button } from '@/components/Button';
import { SavedGame } from '@/types/game';

type LoadGameModalProps = {
  visible: boolean;
  onClose: () => void;
  onLoad: (saveId: string) => void;
  savedGames: SavedGame[];
};

export function LoadGameModal({ visible, onClose, onLoad, savedGames }: LoadGameModalProps) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Load Game</Text>
            
            <Pressable
              style={styles.newGameButton}
              onPress={() => onLoad('new')}
            >
              <Image 
                source={require('@/assets/images/add.svg')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: theme.colors.primary
                }}
              />
              <Text style={styles.newGameText}>New Game</Text>
            </Pressable>
            
            {savedGames.length > 0 ? (
              <FlatList
                data={savedGames}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.saveItem}
                    onPress={() => onLoad(item.id)}
                  >
                    <Text style={styles.saveName}>{item.save_name}</Text>
                    <Text style={styles.saveDate}>
                      {new Date(item.saved_at).toLocaleDateString()}
                    </Text>
                  </Pressable>
                )}
              />
            ) : (
              <Text style={styles.noSavesText}>No saved games</Text>
            )}
            
            <Button title="Close" onPress={onClose} variant="secondary" />
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
    newGameButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 8,
        marginBottom: theme.spacing.md,
    },
    newGameText: {
        marginLeft: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    noSavesText: {
        textAlign: 'center',
        color: '#6B7280',
        marginVertical: theme.spacing.lg,
    },
});