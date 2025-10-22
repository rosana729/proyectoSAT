// Conexión a Supabase (safe initializer)
const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('./keys');

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_KEY not set. Supabase client will not be initialized.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Error initializing Supabase client:', err.message || err);
    supabase = null;
  }
}

module.exports = {
  client: supabase,
  getClient: () => {
    if (!supabase) throw new Error('Supabase client not initialized. Set SUPABASE_URL and SUPABASE_KEY.');
    return supabase;
  }
};
