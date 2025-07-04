# 7. Autenticación con Google usando Supabase

## 🎯 Objetivo
Añadir la opción de iniciar sesión con Google a nuestra aplicación usando Supabase Auth.

## 📋 Pre-requisitos
- Tener implementada la autenticación básica con Supabase (Tutorial 5)
- Cuenta de Google
- Acceso al dashboard de Supabase

## 🔧 Configuración en Supabase

### Paso 1: Habilitar Google Provider

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. En el menú lateral, ve a **Authentication** → **Providers**
3. Busca **Google** en la lista y haz clic en él
4. Activa el switch para habilitarlo

### Paso 2: Configurar Google OAuth

#### Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs y servicios** → **Credenciales**
4. Haz clic en **Crear credenciales** → **ID de cliente OAuth**
5. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: "Fitness Management System"
   - Correo de soporte: tu email
   - Información de contacto: tu email

#### Crear credenciales OAuth

1. En **Tipo de aplicación**, selecciona **Aplicación web**
2. Nombre: "Fitness Pro Supabase"
3. En **Orígenes autorizados de JavaScript**, añade:
   ```
   http://localhost:5173
   https://tuproyecto.supabase.co
   ```
4. En **URIs de redirección autorizados**, añade:
   ```
   https://tuproyecto.supabase.co/auth/v1/callback
   ```
   ⚠️ Reemplaza `tuproyecto` con tu ID de proyecto de Supabase

5. Haz clic en **Crear**
6. Copia el **Client ID** y **Client Secret**

### Paso 3: Configurar en Supabase

1. Vuelve a Supabase → **Authentication** → **Providers** → **Google**
2. Pega:
   - **Client ID**: El que copiaste de Google
   - **Client Secret**: El que copiaste de Google
3. Guarda los cambios

## 🚀 Implementación en el Frontend

### Paso 1: Actualizar la página de Login

**src/pages/SignInPage.tsx**

Añade la función para login con Google después de `handleSignIn`:

```typescript
const handleGoogleSignIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      setError('Error al iniciar sesión con Google');
    }
  } catch (err) {
    setError('Error al conectar con Google');
  }
};
```

Ahora actualiza el botón de Google para que funcione. Busca esta sección:

```typescript
<IconButton color="inherit">
  <Iconify width={22} icon="logos:google-icon" />
</IconButton>
```

Y reemplázala por:

```typescript
<IconButton 
  color="inherit"
  onClick={handleGoogleSignIn}
  sx={{
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      backgroundColor: 'action.hover',
    }
  }}
>
  <Iconify width={22} icon="logos:google-icon" />
</IconButton>
```

### Paso 2: Mejorar la experiencia del botón (Opcional)

Si prefieres un botón más visible, reemplaza toda la sección de iconos por:

```typescript
<Box sx={{ mt: 3 }}>
  <Button
    fullWidth
    variant="outlined"
    size="large"
    onClick={handleGoogleSignIn}
    startIcon={<Iconify width={22} icon="logos:google-icon" />}
    sx={{
      mb: 2,
      color: 'text.primary',
      borderColor: 'divider',
      '&:hover': {
        backgroundColor: 'action.hover',
        borderColor: 'text.primary',
      }
    }}
  >
    Continuar con Google
  </Button>
</Box>

<Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
  <Typography
    variant="overline"
    sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
  >
    O usa tu email
  </Typography>
</Divider>
```

### Paso 3: Actualizar la página de Registro (Opcional)

**src/pages/SignUpPage.tsx**

Puedes añadir el mismo botón de Google en la página de registro:

```typescript
// Añade la función handleGoogleSignIn (igual que en SignInPage)
const handleGoogleSignIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      setError('Error al registrarse con Google');
    }
  } catch (err) {
    setError('Error al conectar con Google');
  }
};

// Y añade el botón antes del formulario
<Button
  fullWidth
  variant="outlined"
  size="large"
  onClick={handleGoogleSignIn}
  startIcon={<Iconify width={22} icon="logos:google-icon" />}
  sx={{ mb: 3 }}
>
  Registrarse con Google
</Button>
```

## ✅ ¡Listo!

Tu aplicación ahora permite:
- Iniciar sesión con Google
- Registro automático si es la primera vez
- Redirección automática al dashboard después del login

## 🧪 Cómo probarlo

1. **Desarrollo local**:
   - Ve a `/sign-in`
   - Haz clic en el botón de Google
   - Selecciona tu cuenta de Google
   - Deberías ser redirigido al dashboard

2. **Verificar usuario**:
   - Ve a Supabase → **Authentication** → **Users**
   - Deberías ver tu usuario con provider "google"

## ⚠️ Solución de problemas

### Error: "Redirect URI mismatch"
- Verifica que la URL de callback en Google coincida exactamente con la de Supabase
- Asegúrate de incluir `/auth/v1/callback` al final

### No redirige después del login
- Verifica que `redirectTo` use la URL correcta
- En desarrollo: `http://localhost:5173/dashboard`
- En producción: `https://tudominio.com/dashboard`

### Error 400: redirect_uri_mismatch
1. Ve a Google Cloud Console
2. Verifica que las URLs estén correctamente configuradas
3. Espera 5 minutos (Google puede tardar en actualizar)

## 💡 Tips

1. **Múltiples entornos**: Puedes añadir múltiples URLs de redirect en Google
2. **Datos del usuario**: Google proporciona nombre y avatar automáticamente
3. **Primera vez**: Si el usuario no existe, Supabase lo crea automáticamente

## 🎨 Personalización

### Obtener datos del usuario de Google

```typescript
// En cualquier componente
const { data: { user } } = await supabase.auth.getUser();

// user.user_metadata contiene:
// - full_name
// - avatar_url
// - email
```

### Mostrar avatar del usuario

```typescript
{user?.user_metadata?.avatar_url && (
  <Avatar 
    src={user.user_metadata.avatar_url} 
    alt={user.user_metadata.full_name}
  />
)}
```