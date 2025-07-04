# 3. Navegación con React Router (Versión Simplificada)

## 🎯 Objetivo
Añadir navegación básica a nuestra app con React Router DOM v6 y TypeScript.

## 📦 Instalación

```bash
cd frontend
npm install react-router-dom
```

## 🚀 Implementación Rápida

### Paso 1: Crear páginas simples

**src/pages/HomePage.tsx**
```typescript
export const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🏋️ Bienvenido a Fitness Pro</h1>
      <p>Sistema de gestión para entrenadores</p>
    </div>
  );
};
```

**src/pages/ClientsPage.tsx**
```typescript
// Mueve TODO el contenido de App.tsx aquí
import { useState, useEffect } from 'react';
import { Client } from '../types/Client';
import { ClientForm } from '../components/ClientForm';
import { ClientList } from '../components/ClientList';
import * as api from '../services/api';

export const ClientsPage = () => {
  // Pega aquí todo el código que tenías en App.tsx
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // ... resto del código del CRUD ...

  return (
    <div className="app">
      <h1>Gestión de Clientes - Entrenador Fitness</h1>
      <ClientForm
        onSubmit={handleSubmit}
        clientToEdit={editingClient}
        onCancelEdit={handleCancelEdit}
      />
      <ClientList
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
```

### Paso 2: Crear un Layout con navegación

**src/Layout.tsx**
```typescript
import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <nav style={{ 
        background: '#f8f9fa', 
        padding: '1rem',
        marginBottom: '2rem' 
      }}>
        <Link to="/" style={{ marginRight: '1rem' }}>🏠 Inicio</Link>
        <Link to="/clients">👥 Clientes</Link>
      </nav>
      
      {/* Aquí se renderiza la página actual */}
      <Outlet />
    </>
  );
};
```

### Paso 3: Configurar rutas en main.tsx

**src/main.tsx**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements 
} from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from './pages/HomePage'
import { ClientsPage } from './pages/ClientsPage'

// Crear las rutas
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="clients" element={<ClientsPage />} />
    </Route>
  )
)

// Renderizar con RouterProvider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

### Paso 4: Limpiar App.tsx

**src/App.tsx**
```typescript
// Ya no necesitamos este archivo
// Puedes eliminarlo o dejarlo vacío
```

## ✅ ¡Listo!

Tu aplicación ahora tiene:
- Página de inicio en `/`
- Página de clientes en `/clients`
- Navegación entre páginas sin recargar

## 📁 Estructura final

```
src/
├── components/      # Componentes del CRUD
├── pages/          # Páginas nuevas
│   ├── HomePage.tsx
│   └── ClientsPage.tsx
├── services/
├── types/
├── Layout.tsx      # Navegación
└── main.tsx        # Rutas configuradas
```

## 🎨 Mejorar el diseño (Opcional)

Si quieres que se vea mejor, actualiza HomePage:

```typescript
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>🏋️ Fitness Pro</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Gestiona tu negocio de entrenamiento personal
      </p>
      
      <div style={{ marginTop: '3rem' }}>
        <Link 
          to="/clients" 
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Ver Clientes
        </Link>
      </div>
    </div>
  );
};
```

## 💡 Tips

1. **No te compliques**: React Router v6 es más simple que versiones anteriores
2. **Layout compartido**: El componente `<Outlet />` renderiza la página actual
3. **index route**: La ruta con `index` es la página principal (`/`)
4. **Sin Switch**: Ya no necesitas `<Switch>`, las rutas se manejan automáticamente

## 🚀 Próximos pasos

1. Añadir más páginas (Rutinas, Dietas, Pagos)
2. Mejorar el diseño del menú de navegación
3. Añadir iconos y estilos más profesionales
4. Proteger rutas con autenticación