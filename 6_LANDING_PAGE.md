# 6. Crear una Landing Page Pública

## 🎯 Objetivo
Crear una página de inicio pública para que los usuarios no vayan directamente al login. Perfecta para mostrar información sobre tu servicio antes de que se registren.

## 📋 ¿Qué vamos a hacer?
- Crear una landing page atractiva
- Hacerla accesible sin autenticación
- Añadir botones para ir al login/registro
- Mantener las rutas protegidas para el dashboard

## 🚀 Implementación Paso a Paso

### Paso 1: Crear la Landing Page

**src/pages/LandingPage.tsx**
```typescript
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack } from '@mui/material';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4rem' }, fontWeight: 700, mb: 2 }}>
            Fitness App
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            La plataforma completa para gestionar tu negocio de entrenamiento personal
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 6, fontSize: '1.2rem', maxWidth: '600px', mx: 'auto' }}>
            Administra clientes, crea planes de entrenamiento personalizados, 
            gestiona dietas y lleva el control completo de tu negocio fitness.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/sign-in')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Iniciar Sesión
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Crear Cuenta
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
```

### Paso 2: Actualizar las rutas en main.tsx

**src/main.tsx**

Primero, importa la nueva página:
```typescript
import { LandingPage } from './pages/LandingPage'
```

Luego, modifica la estructura de rutas para tener rutas públicas y protegidas:

```typescript
const router = createBrowserRouter([
  // RUTAS PÚBLICAS (sin autenticación)
  {
    path: '/',
    element: <App><LandingPage /></App>,
  },
  {
    path: '/sign-in',
    element: (
      <App>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </App>
    ),
  },
  {
    path: '/register',
    element: (
      <App>
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      </App>
    ),
  },
  
  // RUTAS PROTEGIDAS (requieren autenticación)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <App>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </App>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'diets',
        element: <DietsPage />,
      },
      {
        path: 'workouts',
        element: <WorkoutsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
```

### Paso 3: Actualizar la redirección después del login

**src/pages/SignInPage.tsx**

Cambia la redirección para ir al dashboard:
```typescript
if (!error) {
  navigate('/dashboard');  // Cambiar de '/' a '/dashboard'
}
```

### Paso 4: Actualizar el componente ProtectedRoute

**src/main.tsx**

En el componente `ProtectedRoute`, actualiza la redirección:
```typescript
return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
```

### Paso 5: Actualizar los enlaces del menú (Opcional)

**src/layouts/dashboard/nav-config-dashboard.tsx**

Actualiza las rutas del menú para incluir `/dashboard`:
```typescript
export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Iconify icon="solar:home-angle-bold" />,
  },
  {
    title: 'Usuarios',
    path: '/dashboard/users',
    icon: <Iconify icon="solar:users-group-rounded-bold" />,
  },
  {
    title: 'Dietas',
    path: '/dashboard/diets',
    icon: <Iconify icon="solar:dish-bold" />,
  },
  // ... resto de las rutas
];
```

## 🎨 Mejorar la Landing Page (Opcional)

### Opción 1: Añadir características

```typescript
// Añadir después del Stack de botones en LandingPage.tsx

<Box sx={{ mt: 10 }}>
  <Typography variant="h4" sx={{ mb: 4 }}>
    ¿Por qué elegir Fitness Management System?
  </Typography>
  
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mt: 4 }}>
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>📊 Gestión Completa</Typography>
      <Typography>
        Administra clientes, rutinas, dietas y productos desde un solo lugar.
      </Typography>
    </Box>
    
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>🚀 Fácil de Usar</Typography>
      <Typography>
        Interfaz intuitiva diseñada para entrenadores, no para programadores.
      </Typography>
    </Box>
    
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>💪 Crece tu Negocio</Typography>
      <Typography>
        Herramientas profesionales para llevar tu negocio al siguiente nivel.
      </Typography>
    </Box>
  </Stack>
</Box>
```

### Opción 2: Añadir un navbar simple

```typescript
// Al inicio del return en LandingPage.tsx, antes del Box principal

<AppBar position="absolute" color="transparent" elevation={0}>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
      Fitness Pro
    </Typography>
    <Button color="inherit" onClick={() => navigate('/sign-in')}>
      Iniciar Sesión
    </Button>
  </Toolbar>
</AppBar>
```

## ✅ ¡Listo!

Tu aplicación ahora tiene:
- Landing page pública en `/`
- Dashboard protegido en `/dashboard/*`
- Flujo correcto: Landing → Login → Dashboard

## 🧪 Cómo probarlo

1. **Sin autenticación**:
   - Ve a `/` - Deberías ver la landing page
   - Ve a `/dashboard` - Deberías ser redirigido al login

2. **Con autenticación**:
   - Inicia sesión
   - Deberías ir a `/dashboard`
   - Todas las rutas del dashboard deberían funcionar

## 💡 Mejoras

1. **SEO**: La landing page es perfecta para añadir meta tags y mejorar el SEO
2. **Responsive**: El diseño ya es responsive, pero puedes ajustar más los tamaños
3. **Animaciones**: Considera añadir animaciones con Framer Motion
4. **Imágenes**: Añade imágenes o ilustraciones para hacerla más visual
5. Añadir más secciones a la landing (testimonios, precios, etc.)
6. Implementar un blog público
7. Añadir páginas de términos y privacidad
8. Crear una página "Acerca de"