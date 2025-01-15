import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions, ViewStyle } from 'react-native';
import { theme } from '@/constants/Theme';
import { useState, useRef, ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Cell, CellStyleMap, Command, GameState } from '@/types/game';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lab() {  
  const initialMap: Cell[][] = [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'pacman', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'wall', 'pellet', 'wall', 'pellet', 'wall', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall', 'ghost', 'wall', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'wall', 'wall', 'pellet', 'wall', 'empty', 'wall', 'pellet', 'wall', 'wall', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall', 'wall', 'wall', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'wall', 'pellet', 'wall', 'pellet', 'wall', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ];

  const { width } = useWindowDimensions();
  const isMobile = width < 380; // Add breakpoint check

  const [gameState, setGameState] = useState<GameState>({
    map: initialMap,
    pacman: { x: 1, y: 1 }, // Starting position from the map
    ghosts: [{ x: 5, y: 4 }], // Ghost position from the map
    lives: 3,
    score: 0,
    iterations: 20,
    commands: []
  });

  const [selectedCell, setSelectedCell] = useState<Cell>('wall');
  const [isRunning, setIsRunning] = useState(false);

  const handleCellPress = (x: number, y: number) => {
    const newMap = gameState.map.map(row => [...row]);
    newMap[y][x] = selectedCell;
    setGameState({ ...gameState, map: newMap });
  };

  const handleRun = () => {
    setIsRunning(true);
    // TODO: Implement game logic and command execution
  };

  const handleAbort = () => {
    setIsRunning(false);
    // TODO: Stop command execution
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
      alert('Game saved successfully');
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game');
    }
  };

  const handleLoad = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        setGameState(JSON.parse(savedState));
        alert('Game loaded successfully');
      }
    } catch (error) {
      console.error('Error loading game:', error);
      alert('Failed to load game');
    }
  };

  const MAX_COMMANDS = 10;

  const addCommand = (command: Command) => {
    setGameState({
      ...gameState,
      commands: [...gameState.commands, command]
    });
  };

  const removeCommand = (index: number) => {
    const newCommands = [...gameState.commands];
    newCommands.splice(index, 1);
    setGameState({ ...gameState, commands: newCommands });
  };

  const cellStyles: CellStyleMap = {
    wall: {
      backgroundColor: '#374151',
    },
    empty: {
      backgroundColor: '#F3F4F6',
    },
    pellet: {
      backgroundColor: 'transparent',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    pacman: {
      backgroundColor: 'transparent',
    },
  };

  type IconName = ComponentProps<typeof Ionicons>['name'];

  // Define a mapping for command to icon names
  const commandToIcon: Record<Command, IconName> = {
    'left': 'caret-back',
    'right': 'caret-forward',
    'up': 'caret-up',
    'down': 'caret-down'
  };

  const renderCell = (cell: Cell, x: number, y: number) => (
    <Pressable 
      style={[styles.cell, cellStyles[cell]]}
      onPress={() => handleCellPress(x, y)}
    >
      {cell === 'pacman' && <Ionicons name="ellipse" size={20} color="yellow" />}
      {cell === 'ghost' && <Ionicons name="warning" size={20} color="red" />}
      {cell === 'pellet' && <View style={styles.pellet} />}
    </Pressable>
  );
  
  // Update where command icons are rendered
  const renderCommand = (command: Command, index: number) => (
    <Pressable
      key={index}
      style={styles.command}
      onPress={() => removeCommand(index)}
    >
      <Ionicons 
        name={commandToIcon[command]}
        size={24} 
        color={theme.colors.primary} 
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stat}>Lives: {gameState.lives}</Text>
        <Text style={styles.stat}>Score: {gameState.score}</Text>
        <Text style={styles.stat}>Iterations: {gameState.iterations}</Text>
      </View>

      <View style={styles.mapContainer}>
            {gameState.map.map((row, y) => (
                <View key={`row-${y}`} style={styles.row}>
                {row.map((cell, x) => (
                    <View key={`cell-${y}-${x}`}>
                    {renderCell(cell, x, y)}
                    </View>
                ))}
                </View>
            ))}
      </View>

      <View style={styles.actions}>
        <Button
            title={isMobile ? "" : (isRunning ? "Abort" : "Run")}
            onPress={isRunning ? handleAbort : handleRun}
            icon={
            <Ionicons 
                name={isRunning ? "stop-circle" : "play"} 
                size={20} 
                color="white" 
            />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
        />
        <Button
            title={isMobile ? "" : "Save"}
            onPress={handleSave}
            icon={
            <Ionicons 
                name="save-outline" 
                size={20} 
                color="white" 
            />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
        />
        <Button
            title={isMobile ? "" : "Load"}
            onPress={handleLoad}
            icon={
            <Ionicons 
                name="folder-open-outline" 
                size={20} 
                color="white" 
            />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
        />
        </View>

      <View style={styles.controls}>
        <Text style={styles.subtitle}>Commands</Text>
        <View style={styles.commandButtons}>
            {(['left', 'right', 'up', 'down'] as Command[]).map((command) => (
                <Pressable
                key={command}
                style={[
                    styles.commandButton,
                    gameState.commands.length >= MAX_COMMANDS && styles.commandButtonDisabled
                ]}
                onPress={() => addCommand(command)}
                disabled={gameState.commands.length >= MAX_COMMANDS}
                >
                <Ionicons 
                    name={commandToIcon[command]}
                    size={24} 
                    color={gameState.commands.length >= MAX_COMMANDS ? '#9CA3AF' : theme.colors.primary} 
                />
                </Pressable>
            ))}
        </View>

        <Text style={styles.subtitle}>Sequence</Text>
        <ScrollView horizontal style={styles.sequence}>
            {gameState.commands.map((command, index) => (
            <Pressable
                key={index}
                style={styles.command}
                onPress={() => {
                const newCommands = [...gameState.commands];
                newCommands.splice(index, 1);
                setGameState({ ...gameState, commands: newCommands });
                }}
            >
                <Ionicons 
                name={commandToIcon[command]}
                size={24} 
                color={theme.colors.primary} 
                />
            </Pressable>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stat: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pellet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCD34D', // Warm yellow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  iconButtonSize: {
    width: 40,
    height: 40,
    minWidth: 40,
    padding: 0,
  },
  sequenceContainer: {
    minHeight: 60, // Ensures space for sequence
    marginBottom: theme.spacing.lg,
  },
  sequence: {
    maxHeight: 120, // Increase height for mobile
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping
    gap: theme.spacing.xs,
  },
  controls: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 60, // Add space for bottom navigation
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  commandButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  commandButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commandButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  command: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});