
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yfypgbizwlxsecuexiib.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmeXBnYml6d2x4c2VjdWV4aWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTY4NzYsImV4cCI6MjA1OTM3Mjg3Nn0.8BdGXRfyzlMFtifffJiyvSRK3XoNtYoK2keYUzmMlIU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
