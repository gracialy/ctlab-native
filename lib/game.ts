import { GameState } from "@/types/game";
import { supabase } from "./supabase";

export async function saveGameState(gameState: GameState, saveName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
  
    const { error } = await supabase
      .from('game_states')
      .insert({
        user_id: user.id,
        save_name: saveName,
        map: gameState.map,
        pacman: gameState.pacman,
        ghosts: gameState.ghosts,
        lives: gameState.lives,
        score: gameState.score,
        iterations: gameState.iterations,
    });
  
    if (error) console.error('Error saving game:', error);
  }
  
export async function loadSavedGames() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
  
    const { data, error } = await supabase
      .from('game_states')
      .select('id, save_name, saved_at')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });
  
    if (error) {
      console.error('Error loading saves:', error);
      return [];
    }
  
    return data;
  }
  
export async function loadGameState(saveId: string): Promise<GameState | null> {
    const { data, error } = await supabase
      .from('game_states')
      .select('*')
      .eq('id', saveId)
      .single();
  
    if (error) {
      console.error('Error loading game:', error);
      return null;
    }
  
    return data ? {
      map: data.map,
      pacman: data.pacman,
      ghosts: data.ghosts,
      lives: data.lives,
      score: data.score,
      iterations: data.iterations,
      commands: []
    } : null;
  }