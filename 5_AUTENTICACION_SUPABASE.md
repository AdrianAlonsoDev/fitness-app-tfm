# 5. Autenticación con Supabase Auth

## 🎯 Objetivo
Implementar autenticación real usando Supabase Auth para reemplazar el login simulado de la aplicación.

## 📋 Pre-requisitos
- Tener una cuenta en [Supabase](https://supabase.com)
- Tener el proyecto corriendo con el login simulado funcionando

## 📦 Instalación

```bash
cd frontend
npm install @supabase/supabase-js
```

## 🚀 Implementación Paso a Paso

### Paso 1: Configurar el cliente de Supabase

**src/lib/supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js';

// Obtén estos valores de tu proyecto Supabase
// Ve a Settings > API en el dashboard de Supabase
const supabaseUrl = 'TU_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

⚠️ **Importante**: 
- Reemplaza `TU_SUPABASE_PROJECT_URL` con la URL de tu proyecto
- Reemplaza `TU_SUPABASE_ANON_KEY` con tu clave anónima
- Estos valores los encuentras en: **Settings > API** en Supabase

### Paso 2: Actualizar la página de Login

**src/pages/SignInPage.tsx**

Primero, importa el cliente de Supabase:
```typescript
import { supabase } from '../lib/supabase';
```

Luego, cambia los estados iniciales (quita las credenciales hardcodeadas):
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

Reemplaza la función `handleSignIn` completa:
```typescript
const handleSignIn = useCallback(async () => {
  try {
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setError(error.message);
    } else if (data.user) {
      navigate('/');
    }
  } catch (err) {
    setError('Error al iniciar sesión');
  }
}, [email, password, navigate]);
```

Finalmente, elimina la sección de credenciales de demo al final del archivo. Busca y elimina:
```typescript
<Box sx={{ mt: 3, textAlign: 'center' }}>
  <Typography variant="body2" color="text.secondary">
    Credenciales de demo:
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Email: admin@fitness.com | Contraseña: admin123
  </Typography>
</Box>
```

### Paso 3: Actualizar la página de Registro

**src/pages/SignUpPage.tsx**

Importa Supabase:
```typescript
import { supabase } from '../lib/supabase';
```

Reemplaza el contenido del bloque `try` en `handleSignUp`:
```typescript
try {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
      }
    }
  });

  if (error) {
    setError(error.message);
  } else if (data.user) {
    setSuccess('Cuenta creada exitosamente. Por favor, verifica tu email.');
    setTimeout(() => {
      navigate('/sign-in');
    }, 3000);
  }
} catch (err) {
  setError('Error al crear la cuenta');
}
```

### Paso 4: Actualizar la protección de rutas

**src/main.tsx**

Añade las importaciones necesarias:
```typescript
import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
```

Reemplaza el componente `ProtectedRoute` completo:
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
};
```

### Paso 5: Actualizar el Logout

**src/layouts/dashboard/layout.tsx**

Importa Supabase:
```typescript
import { supabase } from '../../lib/supabase';
```

Reemplaza la función `handleLogout`:
```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate('/sign-in');
  handleUserMenuClose();
};
```

## ✅ ¡Listo!

Tu aplicación ahora tiene autenticación real con Supabase:
- Los usuarios pueden registrarse con email y contraseña
- El login valida contra Supabase (no credenciales hardcodeadas)
- Las rutas protegidas verifican la sesión de Supabase
- El logout limpia correctamente la sesión

## 🧪 Cómo probarlo

1. **Crear un usuario nuevo**:
   - Ve a `/register`
   - Completa el formulario con un email real
   - Supabase enviará un email de confirmación (revisa spam)

2. **Iniciar sesión**:
   - Ve a `/sign-in`
   - Usa el email y contraseña que registraste

3. **Verificar protección**:
   - Intenta acceder a `/` sin estar logueado
   - Deberías ser redirigido a `/sign-in`

## ⚠️ Notas importantes

1. **Sin conexión con la tabla users**: 
   - Esto NO está conectado con tu tabla `public.users`
   - Supabase crea usuarios en su propia tabla `auth.users`
   - Los usuarios del sistema actual NO funcionarán para login

2. **Email de confirmación**:
   - Por defecto, Supabase requiere confirmación por email
   - Puedes desactivarlo en: **Authentication > Providers > Email** en Supabase

3. **Variables de entorno** (Opcional pero recomendado):
   ```env
   VITE_SUPABASE_URL=tu_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_key_aqui
   ```
   
   Y en `supabase.ts`:
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

## 💡 Tips

1. **Para desarrollo local**: Puedes desactivar la confirmación por email en Supabase
2. **Políticas RLS**: Supabase usa Row Level Security - revisa las políticas si tienes problemas
3. **Dashboard de usuarios**: Ve los usuarios registrados en **Authentication > Users** en Supabase

## 🚀 Mejoras

1. Conectar `auth.users` con `public.users` (usando triggers de Supabase)
2. Añadir login social (Google, GitHub)
3. Implementar recuperación de contraseña
4. Añadir roles y permisos