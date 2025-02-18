import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://qllmqcvzsunearychtku.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbG1xY3Z6c3VuZWFyeWNodGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NTM2NDQsImV4cCI6MjA1NTQyOTY0NH0.odGk1c3n-GQgyIh5WxEpc9kPM3tsu7lHtUury7iGVwU';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 