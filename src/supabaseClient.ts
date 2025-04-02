// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkxwjqucrmwgyjbupxop.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHdqcXVjcm13Z3lqYnVweG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTgzMDcsImV4cCI6MjA1OTEzNDMwN30.0IATdw0YpWPXZBY91KtBRIHjQBgKjTK3qPTMv86mysk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
