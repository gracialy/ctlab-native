import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions, Image } from 'react-native';
import { theme } from '@/constants/Theme';
import { useState, useRef, ComponentProps, useEffect } from 'react';
import { Cell, CellStyleMap, Command, GameState, SavedGame } from '@/types/game';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadGameState, loadSavedGames, saveGameState } from '@/lib/game';
import { SaveGameModal } from '@/components/SaveGameModal';
import { LoadGameModal } from '@/components/LoadGameModal';


type WallHighlight = { x: number; y: number } | null;

export default function Lab() {
  const initialMap: Cell[][] = [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'wall', 'pellet', 'wall', 'pellet', 'wall', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'wall', 'wall', 'pellet', 'wall', 'pacman', 'wall', 'pellet', 'wall', 'wall', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'wall', 'wall', 'pellet', 'wall', 'pellet', 'wall', 'wall', 'pellet', 'wall'],
    ['wall', 'pellet', 'pellet', 'pellet', 'pellet', 'wall', 'pellet', 'pellet', 'pellet', 'pellet', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ];

  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width - 32, 768); // Max container width with padding
  const cellSize = Math.floor(containerWidth / 15); // 11 is map size
  const isMobile = width < 380; // Add breakpoint check

  const [gameState, setGameState] = useState<GameState>({
    map: initialMap,
    pacman: { x: 5, y: 5 }, // Starting position from the map
    ghosts: [{ x: 1, y: 1 }, { x: 9, y: 9 }], // Ghost position from the map
    lives: 3,
    score: 0,
    iterations: 20,
    commands: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [wallHighlight, setWallHighlight] = useState<WallHighlight>(null);

  // Update run button disable condition
  const isRunDisabled =
    isRunning ||
    gameState.commands.length === 0 ||
    // Special command must be followed by a direction
    (gameState.commands.some((cmd, index) =>
      (cmd === 'special' || cmd === 'special2') && (
        index === gameState.commands.length - 1 ||
        !['left', 'right', 'up', 'down'].includes(gameState.commands[index + 1])
      )
    ));

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
    const newMap = [...gameState.map.map(row => [...row])];
    let currentPos = { ...gameState.pacman };
    let currentScore = gameState.score;
    let wallHit = false;

    for (let i = 0; i < gameState.commands.length; i++) {
      if (wallHit) break;

      const command = gameState.commands[i];
      await new Promise(resolve => setTimeout(resolve, 500));

      // Handle special commands
      if (command === 'special' || command === 'special2') {
        if (i === gameState.commands.length - 1) continue;

        const nextCommand = gameState.commands[i + 1];
        let canMove = true;

        while (canMove) {
          let nextX = currentPos.x;
          let nextY = currentPos.y;

          switch (nextCommand) {
            case 'left': nextX--; break;
            case 'right': nextX++; break;
            case 'up': nextY--; break;
            case 'down': nextY++; break;
          }

          // Stop conditions
          if (newMap[nextY][nextX] === 'wall' ||
            (command === 'special2' && isCrossroad(newMap, nextX, nextY))) {
            canMove = false;
            continue;
          }

          // Move pacman
          if (newMap[nextY][nextX] === 'pellet') {
            currentScore += 10;
          }

          newMap[currentPos.y][currentPos.x] = 'empty';
          newMap[nextY][nextX] = 'pacman';
          currentPos = { x: nextX, y: nextY };

          await new Promise(resolve => setTimeout(resolve, 100));

          setGameState(prev => ({
            ...prev,
            map: newMap,
            pacman: currentPos,
            score: currentScore
          }));
        }

        i++; // Skip next command as it was used with special
        continue;
      }

      // Handle regular movement
      let newX = currentPos.x;
      let newY = currentPos.y;

      switch (command) {
        case 'left': newX--; break;
        case 'right': newX++; break;
        case 'up': newY--; break;
        case 'down': newY++; break;
      }

      // Check wall collision
      if (newMap[newY][newX] === 'wall') {
        wallHit = true;
        currentScore = Math.max(0, currentScore - 5);

        setWallHighlight({ x: newX, y: newY });
        await new Promise(resolve => setTimeout(resolve, 300));
        setWallHighlight(null);
        setPacmanColor('red');
        await new Promise(resolve => setTimeout(resolve, 300));
        setPacmanColor('yellow');

        // Reset position
        newMap[currentPos.y][currentPos.x] = 'empty';
        currentPos = { x: 5, y: 5 };
        newMap[5][5] = 'pacman';

        continue;
      }

      // Valid move
      if (newMap[newY][newX] === 'pellet') {
        currentScore += 10;
      }

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

    // Final updates
    setGameState(prev => ({
      ...prev,
      commands: [],
      iterations: prev.iterations - 1,
      score: currentScore,
      lives: wallHit ? prev.lives - 1 : prev.lives,
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
        pacman: { x: 5, y: 5 }, // Center position
        ghosts: [
          { x: 1, y: 1 },
          { x: 9, y: 9 }
        ],
        lives: 3,
        score: 0,
        iterations: 20,
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
  const commandImages = {
    'left': require('@/assets/images/caret-left.svg'),
    'right': require('@/assets/images/caret-right.svg'),
    'up': require('@/assets/images/caret-up.svg'),
    'down': require('@/assets/images/caret-down.svg'),
    'special': require('@/assets/images/highway.svg'),
    'special2': require('@/assets/images/crossroads.svg')
  } as const;

  const isCrossroad = (map: Cell[][], x: number, y: number) => {
    const possibleMoves = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];

    console.log(map)

    // Count number of possible moves (non-wall cells)
    const availablePaths = possibleMoves.filter(move =>
      map[y + move.dy][x + move.dx] !== 'wall'
    ).length;

    // It's a crossroad if there are more than 2 possible paths
    return availablePaths > 2;
  };

  const [pacmanColor, setPacmanColor] = useState<string>('yellow');

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
      width: cellSize,
      height: cellSize,
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
      width: cellSize * 0.25, // Scale pellet with cell
      height: cellSize * 0.25,
      borderRadius: cellSize * 0.125,
      backgroundColor: '#FCD34D',
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
    commandButtonsContainer: {
      maxHeight: 70,
    },
    commandButtonsContent: {
      paddingHorizontal: theme.spacing.md,
    },
    commandButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
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
    specialCommandButton: {
      backgroundColor: `${theme.colors.primary}10`,
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

  const renderCell = (cell: Cell, x: number, y: number) => {
    let content = null;

    switch (cell) {
      case 'pacman':
        content = (
          <Image
            source={require('@/assets/images/pacman.svg')}
            style={{
              width: cellSize * 0.7,
              height: cellSize * 0.7,
              tintColor: pacmanColor
            }}
          />
        );
        break;
      // case 'ghost':
      //   content = (
      //     <Image 
      //       source={require('@/assets/images/ghost.svg')}
      //       style={{
      //         width: cellSize * 0.7,
      //         height: cellSize * 0.7,
      //         tintColor: 'red'
      //       }}
      //     />
      //   );
      //   break;
      case 'pellet':
        content = <View style={styles.pellet} />;
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
  // const renderCommand = (command: Command, index: number) => (
  //   <Pressable
  //     key={index}
  //     style={styles.command}
  //     onPress={() => removeCommand(index)}
  //   >
  //     <Ionicons
  //       name={commandToIcon[command]}
  //       size={24}
  //       color={theme.colors.primary}
  //     />
  //   </Pressable>
  // );

  return (
    <ScrollView
      style={styles.outerContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.innerContainer}>
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
            title={isMobile ? "" : "Save"}
            onPress={() => setSaveModalVisible(true)}
            icon={
              <Image
                source={require('@/assets/images/save.svg')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginRight: theme.spacing.sm
                }}
              />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
          />

          <Button
            title={isMobile ? "" : (isRunning ? "Abort" : "Run")}
            onPress={isRunning ? handleAbort : handleRun}
            disabled={isRunDisabled}
            icon={
              <Image
                source={isRunning ? require('@/assets/images/stop.svg') : require('@/assets/images/play.svg')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginRight: theme.spacing.sm
                }}
              />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
          />

          <Button
            title={isMobile ? "" : "Load"}
            onPress={() => setLoadModalVisible(true)}
            icon={
              <Image
                source={require('@/assets/images/folder.svg')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginRight: theme.spacing.sm
                }}
              />
            }
            style={isMobile ? styles.iconButtonSize : undefined}
          />
        </View>

        <View style={styles.controls}>
          <Text style={styles.subtitle}>Commands</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.commandButtonsContainer}
            contentContainerStyle={styles.commandButtonsContent}
          >
            <View style={styles.commandButtons}>
              {/* Regular direction commands */}
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
                  <Image
                    source={commandImages[command]}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: (gameState.iterations <= 0 || gameState.lives <= 0) ?
                        '#9CA3AF' : theme.colors.primary
                    }}
                  />
                </Pressable>
              ))}

              {/* Special command button */}
              {(['special', 'special2'] as Command[]).map((command) => (
                <Pressable
                  key={command}
                  style={[
                    styles.commandButton,
                    styles.specialCommandButton,
                    (gameState.iterations <= 0 || gameState.lives <= 0 ||
                      gameState.commands.length >= MAX_COMMANDS) &&
                    styles.commandButtonDisabled
                  ]}
                  onPress={() => addCommand(command)}
                  disabled={gameState.iterations <= 0 || gameState.lives <= 0 ||
                    gameState.commands.length >= MAX_COMMANDS}
                >
                  <Image
                    source={commandImages[command]}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: (gameState.iterations <= 0 || gameState.lives <= 0) ?
                        '#9CA3AF' : theme.colors.primary
                    }}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>

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
                <Image
                  source={commandImages[command]}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: (gameState.iterations <= 0 || gameState.lives <= 0) ?
                      '#9CA3AF' : theme.colors.primary
                  }}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}