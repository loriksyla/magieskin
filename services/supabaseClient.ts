import { createClient } from '@supabase/supabase-js';

// We are hardcoding these to ensure they work in your deployed environment immediately.
// The "Anon" key is safe to be used in the client-side browser.
const supabaseUrl = 'https://cmhjpwranbroveysviuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaGpwd3JhbmJyb3ZleXN2aXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDg2NzcsImV4cCI6MjA4NTM4NDY3N30.s9n1kGy0tESYLpt_Nc5oFT4MNqMCBmyaRqEvy6co6dwOk';

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase Client Initialized:", !!supabase);