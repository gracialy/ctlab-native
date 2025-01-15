import { supabase } from './supabase';

export async function updateProgress(moduleId: string, pageIndex: number, completed = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
  
    // First get existing progress
    const { data: existingProgress } = await supabase
      .from('module_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single();
  
    const updates = {
      user_id: user.id,
      module_id: moduleId,
      last_page_index: pageIndex,
      last_access_time: new Date().toISOString(),
      // Only set completed_at if not already set
      ...(completed && !existingProgress?.completed_at ? { completed_at: new Date().toISOString() } : {})
    };

  const { error } = await supabase
    .from('module_progress')
    .upsert(updates, { onConflict: 'user_id,module_id' });

  if (error) console.error('Error updating progress:', error);
}

export async function getModuleProgress(moduleId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('module_id', moduleId)
    .single();

  if (error && error.code !== 'PGRST116') console.error('Error fetching progress:', error);
  return data;
}