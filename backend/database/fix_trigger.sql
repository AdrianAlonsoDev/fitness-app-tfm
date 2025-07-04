-- =====================================
-- ARREGLO: Trigger de creación de usuarios
-- =====================================
-- Ejecutar en el SQL Editor de Supabase

-- PASO 1: Eliminar el trigger actual (si existe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- PASO 2: Eliminar la función actual (si existe)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- PASO 3: Crear función mejorada para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, name, surname, email, birth_date, created_at, role)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'first_name',  -- Los datos reales usan 'first_name'
      new.raw_user_meta_data->>'name',        -- Compatibilidad con 'name'
      ''
    ),
    COALESCE(
      new.raw_user_meta_data->>'last_name',   -- Los datos reales usan 'last_name'
      new.raw_user_meta_data->>'surname',     -- Compatibilidad con 'surname'
      ''
    ),
    new.email,
    CASE 
      WHEN new.raw_user_meta_data->>'birth_date' IS NOT NULL AND new.raw_user_meta_data->>'birth_date' != ''
      THEN (new.raw_user_meta_data->>'birth_date')::date
      ELSE NULL
    END,
    now(),
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 4: Crear el trigger actualizado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- VERIFICACIÓN: Ver usuarios en auth.users y public.users
SELECT 'Usuarios en auth.users:' as tabla, count(*) as total FROM auth.users;
SELECT 'Usuarios en public.users:' as tabla, count(*) as total FROM public.users;

-- Ver los últimos usuarios creados con sus metadatos
SELECT 
  id, 
  email, 
  raw_user_meta_data,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 3;
