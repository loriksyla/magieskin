import { createClient } from '@supabase/supabase-js';

// These would come from your hosting provider's environment variables
// Example: process.env.SUPABASE_URL
const supabaseUrl = process.env.SUPABASE_URL || ''; 
const supabaseKey = process.env.SUPABASE_KEY || '';

// Only initialize if keys are present (allows fallback to demo mode if not configured)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;