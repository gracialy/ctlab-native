import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

const supabaseUrl = 'https://qnmfophyqgvlmlfuuvxq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFubWZvcGh5cWd2bG1sZnV1dnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTk3OTQsImV4cCI6MjA1MjUzNTc5NH0.EZ2UGw5gjcnsMkg4dTsXviCFlvKhFncn2OVm397Sddc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});