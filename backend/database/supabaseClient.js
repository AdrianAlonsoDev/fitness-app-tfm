require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Cliente para operaciones normales (con ANON_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY 
);

// Cliente para operaciones de administrador (con SERVICE_ROLE_KEY)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase ANON_KEY configurada:', process.env.SUPABASE_ANON_KEY ? '✅' : '❌');
console.log('Supabase SERVICE_ROLE_KEY configurada:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');

module.exports = { supabase, supabaseAdmin };