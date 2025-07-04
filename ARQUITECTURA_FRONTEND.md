# 🎨 Arquitectura Frontend - Fitness Management Pro

## 📋 Resumen

Single Page Application (SPA) construida con React, TypeScript y Material-UI, optimizada para gestión de negocios fitness.

## 🏗️ Estructura de Componentes

```mermaid
graph TD
    A[App] --> B[Router]
    B --> C[Public Routes]
    B --> D[Protected Routes]
    
    C --> E[LandingPage]
    C --> F[SignInPage]
    C --> G[SignUpPage]
    
    D --> H[DashboardLayout]
    H --> I[HomePage]
    H --> J[UsersPage]
    H --> K[DietsPage]
    H --> L[WorkoutsPage]
    H --> M[ProductsPage]
    
    J --> N[UserManager]
    N --> O[UserList]
    N --> P[UserForm]
    N --> Q[UserCard]
    
    style A fill:#61dafb
    style H fill:#4fc3f7
    style N fill:#81c784
```

## 📁 Organización de Carpetas

```
frontend/src/
├── components/           # Componentes reutilizables
│   ├── User/
│   │   ├── UserCard.tsx
│   │   ├── UserForm.tsx
│   │   ├── UserList.tsx
│   │   └── UserManager.tsx
│   ├── Diet/
│   ├── Product/
│   └── Workout/
│
├── pages/               # Vistas/Rutas principales
│   ├── HomePage.tsx
│   ├── SignInPage.tsx
│   ├── LandingPage.tsx
│   └── [Entity]Page.tsx
│
├── services/            # Capa de servicios API
│   ├── userService.ts
│   ├── dietService.ts
│   └── api.ts
│
├── layouts/             # Layouts de aplicación
│   ├── dashboard/
│   └── auth/
│
├── lib/                 # Configuraciones externas
│   └── supabase.ts
│
├── types/               # TypeScript types/interfaces
│   ├── User.ts
│   ├── Diet.ts
│   └── index.ts
│
└── utils/               # Utilidades y hooks
    ├── hooks/
    ├── notifications.tsx
    └── iconify.tsx
```

## 🔄 Flujo de Datos

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service
    participant A as API
    participant ST as State
    
    C->>S: Llamar servicio
    S->>A: HTTP Request
    A-->>S: Response
    S-->>C: Datos procesados
    C->>ST: Actualizar estado
    ST-->>C: Re-render
```

## 🧩 Patrones de Componentes

### 1. Manager Pattern
```typescript
// UserManager maneja toda la lógica
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  
  // Lógica centralizada
  const handleCreate = () => {...}
  const handleEdit = () => {...}
  const handleDelete = () => {...}
  
  return (
    <>
      <UserForm onSubmit={handleCreate} />
      <UserList 
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};
```

### 2. Service Layer Pattern
```typescript
// userService.ts
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

// Component
const loadUsers = async () => {
  const data = await userService.getUsers();
  setUsers(data);
};
```

### 3. Custom Hooks
```typescript
// useToast.tsx
export const useToast = () => {
  const [open, setOpen] = useState(false);
  const showToast = (message: string) => {...};
  return { showToast, ToastContainer };
};
```

## 🎨 Sistema de Diseño

### Tema Material-UI
- **Primary Color**: Purple gradient (#667eea → #764ba2)
- **Typography**: DM Sans + Barlow
- **Spacing**: 8px grid system
- **Breakpoints**: xs, sm, md, lg, xl

### Componentes Base
```mermaid
graph LR
    A[Material-UI] --> B[Custom Theme]
    B --> C[Styled Components]
    C --> D[App Components]
    
    E[Iconify] --> D
    F[ApexCharts] --> D
```

## 🚦 Enrutamiento

```typescript
// Estructura de rutas
const router = createBrowserRouter([
  // Públicas
  { path: '/', element: <LandingPage /> },
  { path: '/sign-in', element: <SignInPage /> },
  
  // Protegidas
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'users', element: <UsersPage /> }
    ]
  }
]);
```

## 🔐 Manejo de Estado

### Estado Local
- `useState` para UI y formularios
- `useEffect` para side effects
- `useCallback` para optimización

### Estado Global
- Context API para tema
- Supabase Auth para sesión
- Props drilling minimizado

## 📊 Flujo de Autenticación

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> SignIn
    SignIn --> Authenticating
    Authenticating --> Dashboard: Success
    Authenticating --> SignIn: Error
    Dashboard --> SignIn: Logout
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px


## 💡 Decisiones Arquitectónicas

### ✅ TypeScript Strict Mode
- Prevención de errores en tiempo de compilación
- Mejor experiencia de desarrollo
- Refactoring más seguro

### ✅ Component-Based Architecture
- Reutilización máxima
- Testing aislado
- Mantenimiento simplificado

### ✅ Service Layer
- Separación de concerns
- API calls centralizadas
- Fácil mockeo para tests
