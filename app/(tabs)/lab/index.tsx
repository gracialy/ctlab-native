import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { theme } from '@/constants/Theme';
import { useState, useRef, ComponentProps, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Cell, CellStyleMap, Command, GameState, Position, SavedGame } from '@/types/game';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadGameState, loadSavedGames, saveGameState } from '@/lib/game';
import { SaveGameModal } from '@/components/SaveGameModal';
import { LoadGameModal } from '@/components/LoadGameModal';


type WallHighlight = { x: number; y: number } | null;
type IconName = ComponentProps<typeof Ionicons>['name'];

export default function Lab() {  
  const initialMap: Cell[][] = [
    ['wall', 'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall'],
    ['wall', 'ghost',  'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall',   'wall',   'pellet', 'wall',   'pellet', 'wall',   'wall',   'pellet', 'wall'],
    ['wall', 'pellet', 'wall',   'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall',   'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall',   'pellet',  'wall',   'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall',   'pellet', 'pellet', 'pacman', 'pellet',  'pellet', 'wall',   'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall',   'pellet',  'wall',   'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall',   'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall',   'pellet', 'wall'],
    ['wall', 'pellet', 'wall',   'wall',   'pellet', 'wall',   'pellet', 'wall',   'wall',   'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'ghost',  'wall'],
    ['wall', 'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall',   'wall'],
  ];
  const initialPacman: Position = { x: 5, y: 5 }; // Center
  const initialGhost: Position[] = [
    { x: 1, y: 1 },
    { x: 9, y: 9 }
  ];
  const initialLives = 3;
  const initialScore = 0;
  const initialIterations = 20;

  const resetPositions = () => {
    const newMap = [...gameState.map];
    
    // Clear current positions
    newMap[gameState.pacman.y][gameState.pacman.x] = 'empty';
    gameState.ghosts.forEach(ghost => {
      newMap[ghost.y][ghost.x] = 'empty';
    });
    
    // Set new positions
    newMap[initialPacman.y][initialPacman.x] = 'pacman';
    initialGhost.forEach(pos => {
      newMap[pos.y][pos.x] = 'ghost';
    });
    
    setGameState(prev => ({
      ...prev,
      map: newMap,
      pacman: initialPacman,
      ghosts: [...initialGhost]
    }));
  };

  const { width } = useWindowDimensions();
  const isMobile = width < 380; // Add breakpoint check

  const [gameState, setGameState] = useState<GameState>({
    map: initialMap,
    pacman: initialPacman, // Starting position from the map
    ghosts: initialGhost, // Ghost position from the map
    lives: initialLives,
    score: initialScore,
    iterations: initialIterations,
    commands: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [wallHighlight, setWallHighlight] = useState<WallHighlight>(null);

  const handleRun = async () => {
    if (gameState.iterations <= 0) {
      alert('No more iterations left!');
      return;
    }
  
    if (gameState.lives <= 0) {
      alert('Game Over - No more lives!');
      return;
    }
  
    setIsRunning(true);
    const newMap = [...gameState.map];
    let currentPos = { ...gameState.pacman };
    let currentScore = gameState.score;
    let wallHit = false;
    let ghostHit = false;
  
    // Execute each command
    for (const command of gameState.commands) {
      if (wallHit || ghostHit) break;
  
      await new Promise(resolve => setTimeout(resolve, 500)); // Animation delay
      
      let newX = currentPos.x;
      let newY = currentPos.y;
  
      switch (command) {
        case 'left': newX--; break;
        case 'right': newX++; break;
        case 'up': newY--; break;
        case 'down': newY++; break;
      }
  
      // Check if move hits wall
      if (newMap[newY][newX] === 'wall') {
        wallHit = true;
        currentScore = Math.max(0, currentScore - 5);
        
        setWallHighlight({ x: newX, y: newY });
        await new Promise(resolve => setTimeout(resolve, 300));
        setWallHighlight(null);
  
        resetPositions();
        continue;
      }
  
      // Check if move hits ghost
      if (newMap[newY][newX] === 'ghost') {
        ghostHit = true;
        currentScore = Math.max(0, currentScore - 5);
        
        setPacmanColor('red');
        await new Promise(resolve => setTimeout(resolve, 300));
        setPacmanColor('yellow');
  
        resetPositions();
        continue;
      }
  
      // Valid move
      if (newMap[newY][newX] === 'pellet') {
        currentScore += 10;
      }
  
      // Update map
      newMap[currentPos.y][currentPos.x] = 'empty';
      newMap[newY][newX] = 'pacman';
      currentPos = { x: newX, y: newY };
      
      setGameState(prev => ({
        ...prev,
        map: newMap,
        pacman: currentPos,
        score: currentScore
      }));
    }
  
    // Updates after all commands are executed
    setGameState(prev => ({
      ...prev,
      commands: [], // Reset commands array
      iterations: prev.iterations - 1,
      score: currentScore,
      lives: (wallHit || ghostHit) ? prev.lives - 1 : prev.lives,
    }));
    
    setIsRunning(false);
  };

  const handleAbort = () => {
    setIsRunning(false);
    // Reset to initial state if needed
  };

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);

  const handleSave = async (saveName: string) => {
    await saveGameState(gameState, saveName);
    setSaveModalVisible(false);
  };

  const handleLoad = async (saveId: string) => {
    if (saveId === 'new') {
      setGameState({
        map: initialMap,
        pacman: initialPacman, 
        ghosts: initialGhost,
        lives: initialLives,
        score: initialScore,
        iterations: initialIterations,
        commands: []
      });
    } else {
      const loadedState = await loadGameState(saveId);
      if (loadedState) {
        setGameState(loadedState);
      }
    }
    setLoadModalVisible(false);
  };

  useEffect(() => {
    if (loadModalVisible) {
      loadSavedGames().then(setSavedGames);
    }
  }, [loadModalVisible]);

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

  // Define a mapping for command to icon names
  const commandToIcon: Record<Command, IconName> = {
    'left': 'caret-back',
    'right': 'caret-forward',
    'up': 'caret-up',
    'down': 'caret-down'
  };

  const [pacmanColor, setPacmanColor] = useState<string>('yellow');

  const renderCell = (cell: Cell, x: number, y: number) => {
    let content = null;
    
    switch (cell) {
      case 'pacman':
        content = <Ionicons name="ellipse" size={20} color={pacmanColor} />;
        break;
      case 'ghost':
        content = <Ionicons name="logo-snapchat" size={20} color="red" />;
        break;
      case 'pellet':
        content = <View style={styles.pellet} />;
        break;
      case 'wall':
      case 'empty':
        content = null;
        break;
    }

    const isHighlighted = wallHighlight?.x === x && wallHighlight?.y === y;
  
    return (
        <View style={[
            styles.cell, 
            cell === 'wall' && (isHighlighted ? styles.highlightedWall : styles.wall),
            cell === 'empty' && styles.empty
        ]}>
            {content}
        </View>
    );
  };
  
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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

      <SaveGameModal
        visible={saveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        onSave={handleSave}
      />
      
      <LoadGameModal
        visible={loadModalVisible}
        onClose={() => setLoadModalVisible(false)}
        onLoad={handleLoad}
        savedGames={savedGames}
      />

      <View style={styles.actions}>
        <Button
            title={isMobile ? "" : (isRunning ? "Abort" : "Run")}
            onPress={isRunning ? handleAbort : handleRun}
            disabled={isRunning || gameState.commands.length === 0}
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
          onPress={() => setSaveModalVisible(true)}
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
          onPress={() => setLoadModalVisible(true)}
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
                    (gameState.iterations <= 0 || gameState.lives <= 0 || 
                    gameState.commands.length >= MAX_COMMANDS) && 
                    styles.commandButtonDisabled
                ]}
                onPress={() => addCommand(command)}
                disabled={gameState.iterations <= 0 || gameState.lives <= 0 || 
                            gameState.commands.length >= MAX_COMMANDS}
              >
                <Ionicons 
                    name={commandToIcon[command]}
                    size={24} 
                    color={(gameState.iterations <= 0 || gameState.lives <= 0) ? 
                        '#9CA3AF' : theme.colors.primary} 
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: 20, // Space for bottom navigation
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
  empty: {
    backgroundColor: '#F3F4F6',
  },
  wall: {
    backgroundColor: theme.colors.primary,
  },
  highlightedWall: {
    backgroundColor: '#EF4444', // Red color for collision
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