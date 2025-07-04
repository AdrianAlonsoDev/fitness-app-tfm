# 📁 Documentación del Árbol de Archivos - Sistema de Gestión Fitness

Este documento proporciona una visión completa de la estructura del proyecto con descripciones para cada archivo y directorio para ayudar a los desarrolladores a entender qué modificar.

## 📋 Vista General de la Estructura del Proyecto

```
RepoEjemplo/
├── backend/                    # Servidor API Node.js/Express
├── frontend/                   # SPA React/TypeScript
├── docker-compose.yml         # Config Docker para PostgreSQL local
└── [Archivos de documentación] # Tutoriales y docs de arquitectura
```

## 🔧 Archivos del Nivel Raíz

| Archivo | Propósito | Cuándo Modificar |
|---------|-----------|------------------|
| `docker-compose.yml` | Config del contenedor PostgreSQL | Al cambiar configuración de BD |
| `README.md` | Documentación principal del proyecto | Al agregar funciones o cambiar setup |
| `FILE_TREE.md` | Este archivo - guía de estructura | Al agregar nuevos módulos |
| `ARQUITECTURA*.md` | Documentación de arquitectura | Al hacer cambios arquitectónicos |
| `[1-7]_*.md` | Tutoriales paso a paso | Al actualizar materiales de aprendizaje |

## 🚀 Estructura del Backend (`/backend`)

### Archivos Principales
```
backend/
├── index.js                   # Configuración del servidor Express y registro de rutas
├── package.json              # Dependencias y scripts
└── package-lock.json         # Archivo de bloqueo de dependencias
```

| Archivo | Propósito | Cuándo Modificar |
|---------|-----------|------------------|
| `index.js` | Configuración del servidor, middleware, montaje de rutas | Al agregar nuevas rutas o middleware |
| `package.json` | Dependencias del backend | Al instalar nuevos paquetes |

### Base de Datos (`/backend/database`)
```
database/
├── schema.sql               # Esquema de base de datos PostgreSQL
└── supabaseClient.js       # Configuración de conexión Supabase
```

| Archivo | Propósito | Cuándo Modificar |
|---------|-----------|------------------|
| `schema.sql` | Tablas y relaciones de BD | Al agregar nuevas tablas o columnas |
| `supabaseClient.js` | Inicialización del cliente Supabase | Al cambiar conexión de BD |

### Rutas (`/backend/routes`)
```
routes/
├── users.js                # Operaciones CRUD de usuarios
├── diets.js               # Gestión de dietas
├── workouts.js            # Gestión de rutinas/entrenamientos
├── exercises.js           # Biblioteca de ejercicios
├── workouts_exercises.js  # Relaciones rutina-ejercicio
├── ecommerce.js          # Gestión de productos
└── clients.zip           # Rutas de clientes archivadas
```

| Ruta | Endpoints | Propósito |
|------|-----------|-----------|
| `users.js` | `/api/users/*` | Gestión de usuarios (CRUD) |
| `diets.js` | `/api/diets/*` | Planes de dieta y asignaciones |
| `workouts.js` | `/api/workouts/*` | Rutinas de entrenamiento |
| `exercises.js` | `/api/exercises/*` | Biblioteca de ejercicios |
| `ecommerce.js` | `/api/products/*` | Catálogo de productos |

## ⚛️ Estructura del Frontend (`/frontend`)

### Archivos de Configuración
```
frontend/
├── index.html              # Punto de entrada HTML
├── package.json           # Dependencias y scripts
├── vite.config.ts        # Configuración de build Vite
├── tsconfig.json         # Configuración TypeScript
└── eslint.config.js      # Reglas de linting
```

| Archivo | Propósito | Cuándo Modificar |
|---------|-----------|------------------|
| `vite.config.ts` | Config de build y servidor dev | Al agregar alias o plugins |
| `tsconfig.json` | Opciones del compilador TypeScript | Al cambiar strictness de TS |
| `eslint.config.js` | Reglas de calidad de código | Al ajustar reglas de linting |

### Código Fuente (`/frontend/src`)

#### Puntos de Entrada
```
src/
├── main.tsx               # Bootstrap de app y routing
├── App.tsx               # Componente raíz con providers
└── config-global.ts      # Configuración global de app
```

#### Componentes (`/src/components`)

**Gestión de Usuarios**
```
User/
├── UserManager.tsx       # Componente principal de gestión de usuarios
├── UserList.tsx         # Visualización tabla/grid de usuarios
├── UserCard.tsx         # Tarjeta individual de usuario
└── UserForm.tsx         # Formulario crear/editar usuario
```

**Gestión de Dietas**
```
Diet/
├── DietManager.tsx      # Gestión principal de dietas
├── DietList.tsx        # Listado de dietas
├── DietCard.tsx        # Visualización tarjeta de dieta
├── DietForm.tsx        # Formulario crear/editar dieta
└── DietUsersDialog.tsx # Asignar dietas a usuarios
```

**Gestión de Productos**
```
Product/
├── ProductManager.tsx   # Gestión principal de productos
├── ProductList.tsx     # Grid de productos
├── ProductCard.tsx     # Tarjeta de producto
├── ProductForm.tsx     # Formulario crear/editar producto
└── ProductListTable.tsx # Vista de tabla
```

**Gestión de Rutinas**
```
Workout/
├── WorkoutManager.tsx   # Gestión principal de rutinas
├── WorkoutList.tsx     # Listado de rutinas
├── WorkoutCard.tsx     # Tarjeta de rutina
├── WorkoutForm.tsx     # Formulario crear/editar rutina
├── WorkoutDetail.tsx   # Vista detallada de rutina
└── workout-exercises-manager.tsx # Asignación de ejercicios
```

#### Páginas (`/src/pages`)

| Página | Ruta | Propósito |
|--------|------|-----------|
| `HomePage.tsx` | `/` | Dashboard/inicio |
| `UsersPage.tsx` | `/users` | Gestión de usuarios |
| `UserDetailPage.tsx` | `/users/:id` | Detalles del perfil de usuario |
| `DietsPage.tsx` | `/diets` | Gestión de dietas |
| `WorkoutsPage.tsx` | `/workouts` | Gestión de rutinas |
| `ProductsPage.tsx` | `/products` | Catálogo de productos |
| `ProfilePage.tsx` | `/profile` | Perfil del usuario actual |
| `SignInPage.tsx` | `/sign-in` | Inicio de sesión |
| `SignUpPage.tsx` | `/sign-up` | Registro |

#### Servicios (`/src/services`)

| Servicio | Propósito | Endpoints API |
|----------|-----------|---------------|
| `userService.ts` | Operaciones de datos de usuario | `/api/users` |
| `dietService.ts` | Gestión de dietas | `/api/diets` |
| `workoutService.ts` | Operaciones de rutinas | `/api/workouts` |
| `exerciseService.ts` | Biblioteca de ejercicios | `/api/exercises` |
| `productService.ts` | Gestión de productos | `/api/products` |
| `notificationService.ts` | Notificaciones toast | N/A (solo frontend) |

#### Tipos (`/src/types`)

```
types/
├── user.ts              # Interfaz y tipos de usuario
├── diet.ts             # Tipos relacionados con dietas
├── product.ts          # Tipos de productos
├── workout.ts          # Tipos de rutinas
├── exercise.ts         # Tipos de ejercicios
└── food.ts             # Tipos de alimentos
```

#### Layouts (`/src/layouts`)

```
layouts/
├── dashboard/          # Layout principal de la app
│   ├── index.tsx      # Wrapper del dashboard
│   └── sidebar/       # Sidebar de navegación
├── auth/              # Layout de páginas de auth
└── core/              # Componentes de layout compartidos
```

#### Utilidades (`/src/utils`)

| Utilidad | Propósito | Uso |
|----------|-----------|-----|
| `iconify/` | Wrapper de biblioteca de iconos | Iconos en toda la app |
| `notifications/` | Componentes de notificación | Retroalimentación al usuario |
| `scrollbar/` | Scrollbar personalizado | Scroll estilizado |
| `chart/` | Wrapper de gráficos | Visualización de datos |
| `hooks/` | Hooks React personalizados | `useExport`, `useNotifications` |

#### Otros Directorios

```
src/
├── styles/            # Archivos CSS
│   ├── global.css    # Estilos globales
│   └── components.css # Estilos de componentes
├── theme/            # Configuración del tema MUI
├── lib/              # Configuraciones de bibliotecas externas
│   └── supabase.ts   # Cliente Supabase
└── assets/           # Imágenes, iconos
```

## 🎯 Referencia Rápida - Dónde Hacer Cambios

### Agregar un Nuevo Módulo de Funcionalidad

1. **Ruta Backend**: Crear nuevo archivo en `/backend/routes/`
2. **Registrar Ruta**: Agregar a `/backend/index.js`
3. **Servicio Frontend**: Crear en `/frontend/src/services/`
4. **Tipos**: Definir en `/frontend/src/types/`
5. **Componentes**: Crear carpeta en `/frontend/src/components/`
6. **Página**: Crear en `/frontend/src/pages/`
7. **Ruta**: Agregar a `/frontend/src/main.tsx`
8. **Navegación**: Actualizar `/frontend/src/layouts/nav-config-dashboard.tsx`

### Modificaciones Comunes

| Tarea | Archivos a Modificar |
|-------|---------------------|
| Agregar nuevo endpoint API | `/backend/routes/[modulo].js` + `/backend/index.js` |
| Agregar tabla de BD | `/backend/database/schema.sql` |
| Agregar nueva página | `/frontend/src/pages/` + `/frontend/src/main.tsx` |
| Actualizar navegación | `/frontend/src/layouts/nav-config-dashboard.tsx` |
| Agregar nuevo componente | `/frontend/src/components/[modulo]/` |
| Cambiar tema | `/frontend/src/theme/` |
| Agregar autenticación | `/frontend/src/lib/supabase.ts` + guardias de ruta |
| Agregar formato de exportación | `/frontend/src/utils/hooks/useExport.tsx` |

## 📝 Flujo de Trabajo de Desarrollo

1. **Cambios Backend**: 
   - Modificar rutas en `/backend/routes/`
   - Ejecutar `npm run dev` en carpeta backend
   - Probar con Postman/Insomnia

2. **Cambios Frontend**:
   - Componentes en `/frontend/src/components/`
   - Servicios para llamadas API en `/frontend/src/services/`
   - Ejecutar `npm run dev` en carpeta frontend

3. **Cambios de Base de Datos**:
   - Actualizar `/backend/database/schema.sql`
   - Ejecutar en editor SQL de Supabase
   - Actualizar tipos en `/frontend/src/types/`

## 🔗 Dependencias Clave

### Backend
- Express 5.1.0 - Framework web
- @supabase/supabase-js - Cliente de base de datos
- cors - Soporte cross-origin
- nodemon - Servidor de desarrollo

### Frontend
- React 19.1.0 - Biblioteca UI
- TypeScript 5.8.3 - Seguridad de tipos
- Material-UI v7 - Biblioteca de componentes
- Vite 6.3.5 - Herramienta de build
- React Router v7 - Enrutamiento
- ApexCharts - Visualización de datos

## 🚨 Notas Importantes

1. **Variables de Entorno**: Requeridas en archivo `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

2. **Autenticación**: Todas las rutas excepto `/sign-in` y `/sign-up` están protegidas

3. **Base de Datos**: Usa Supabase (PostgreSQL) - el esquema debe ejecutarse en el editor SQL de Supabase

4. **Estilos**: Usa sistema de temas Material-UI + CSS personalizado

5. **TypeScript**: Modo estricto habilitado - todo código nuevo debe estar correctamente tipado