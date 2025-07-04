# Plan de Implementación: Integración de Supabase Auth con Tabla Users

## 📋 Resumen Ejecutivo

Este documento describe el plan para conectar correctamente el sistema de autenticación de Supabase con la tabla `users` personalizada, creando un sistema unificado y seguro.

## 🎯 Objetivos

1. Conectar `auth.users` de Supabase con `public.users`
2. Implementar autenticación en el backend
3. Eliminar vulnerabilidades de seguridad
4. Mantener sincronizados ambos sistemas

## 📊 Estado Actual vs Estado Deseado

### Estado Actual ❌
- Dos sistemas de usuarios desconectados
- Backend sin autenticación
- Contraseñas en texto plano en `public.users`
- No hay verificación de JWT en API

### Estado Deseado ✅
- Un sistema unificado de usuarios
- Backend protegido con JWT
- Solo Supabase maneja contraseñas
- Sincronización automática entre sistemas

## 🛠️ Plan de Implementación

### Fase 1: Preparación de Base de Datos (2-3 horas)

#### 1.1 Modificar Tabla Users
```sql
-- Agregar columna para vincular con Supabase Auth
ALTER TABLE public.users 
ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Eliminar columna de contraseña (después de migrar datos)
ALTER TABLE public.users 
DROP COLUMN password;

-- Crear índice para mejorar rendimiento
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
```

#### 1.2 Crear Trigger para Sincronización
```sql
-- Función para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, name, surname, email, created_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta al crear usuario en auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Fase 2: Backend - Middleware de Autenticación (3-4 horas)

#### 2.1 Instalar Dependencias
```bash
cd backend
npm install jsonwebtoken @supabase/supabase-js
```

#### 2.2 Crear Middleware de Autenticación
```javascript
// backend/middleware/auth.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Necesitamos service role key
);

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verificar el JWT con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    
    // Obtener usuario de nuestra tabla
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    req.user = dbUser;
    req.authUser = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { authenticateToken };
```

#### 2.3 Proteger Rutas del Backend
```javascript
// backend/index.js
const { authenticateToken } = require('./middleware/auth');

// Rutas públicas (no requieren auth)
app.post('/api/auth/signin', signIn);
app.post('/api/auth/signup', signUp);

// Aplicar middleware a todas las rutas protegidas
app.use('/api/users', authenticateToken);
app.use('/api/diets', authenticateToken);
app.use('/api/exercises', authenticateToken);
app.use('/api/workouts', authenticateToken);
// ... etc
```

### Fase 3: Frontend - Enviar Token en Requests (2-3 horas)

#### 3.1 Crear Interceptor de Axios
```typescript
// frontend/src/lib/axios.ts
import axios from 'axios';
import { supabase } from './supabase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

// Interceptor para agregar token a cada request
axiosInstance.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

export default axiosInstance;
```

#### 3.2 Actualizar Servicios
```typescript
// frontend/src/services/userService.ts
import axiosInstance from '../lib/axios';

export const userService = {
  getUsers: async () => {
    const response = await axiosInstance.get('/api/users');
    return response.data;
  },
  // ... resto de métodos usando axiosInstance
};
```

### Fase 4: Migración de Datos Existentes (1-2 horas)

#### 4.1 Script de Migración (Opcional)
```sql
-- Si hay usuarios existentes en public.users sin auth
-- Crear usuarios en Supabase Auth y vincular

-- Este es un proceso manual que requiere:
-- 1. Exportar usuarios existentes
-- 2. Crear cuentas en Supabase Auth via Admin API
-- 3. Actualizar auth_user_id en public.users
```

### Fase 5: Actualizar Flujos de Usuario (2-3 horas)

#### 5.1 Modificar SignUp para Incluir Datos Adicionales
```typescript
// frontend/src/pages/SignUpPage.tsx
const handleSignUp = async (data) => {
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        // Agregar otros campos necesarios
      }
    }
  });
  // El trigger creará automáticamente el registro en public.users
};
```

#### 5.2 Actualizar Endpoints del Backend
```javascript
// backend/routes/users.js
// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, async (req, res) => {
  res.json(req.user); // Usuario ya viene del middleware
});

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .update(req.body)
    .eq('id', req.user.id)
    .select()
    .single();
    
  if (error) return res.status(400).json({ error });
  res.json(data);
});
```

## 🧪 Plan de Pruebas

### Pruebas Unitarias
1. Verificar creación automática de usuario en `public.users`
2. Validar middleware de autenticación
3. Probar endpoints protegidos sin token

### Pruebas de Integración
1. Flujo completo de registro
2. Login y acceso a recursos protegidos
3. Actualización de perfil

### Pruebas de Seguridad
1. Intentar acceder sin token
2. Usar token expirado
3. Verificar que no hay contraseñas en `public.users`

## 📅 Cronograma

| Fase | Duración | Dependencias |
|------|----------|--------------|
| Fase 1: Base de Datos | 2-3 horas | - |
| Fase 2: Backend Auth | 3-4 horas | Fase 1 |
| Fase 3: Frontend | 2-3 horas | Fase 2 |
| Fase 4: Migración | 1-2 horas | Fase 1 |
| Fase 5: Flujos | 2-3 horas | Fase 2, 3 |
| Pruebas | 2-3 horas | Todas |

**Total estimado: 12-18 horas**

## ⚠️ Consideraciones Importantes

1. **Service Role Key**: Necesitarás la service role key de Supabase para el backend
2. **Variables de Entorno**: Actualizar `.env` con nuevas variables
3. **Backup**: Hacer backup de la base de datos antes de cambios
4. **Documentación**: Actualizar docs de API con nuevos headers requeridos

## 🚀 Pasos Siguientes

1. Revisar y aprobar el plan
2. Configurar entorno de desarrollo
3. Implementar fase por fase
4. Realizar pruebas exhaustivas
5. Deploy a producción con rollback plan

## 📝 Notas Adicionales

- Este plan mantiene compatibilidad hacia atrás durante la transición
- Se puede implementar por fases sin romper funcionalidad existente
- Considerar Row Level Security (RLS) para seguridad adicional