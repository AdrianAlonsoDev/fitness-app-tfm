# 🏋️ Sistema de Gestión Fitness - Full Stack Application

Sistema completo de gestión para entrenadores fitness que permite administrar clientes, dietas, rutinas de ejercicio y productos. Desarrollado con React, TypeScript, Node.js y Express.

## 🏗️ Documentación de Arquitectura

Para entender cómo está construido el sistema, revisa estos documentos:

- **[Arquitectura General](./ARQUITECTURA.md)** - Visión completa del sistema, tecnologías y decisiones de diseño
- **[Arquitectura Frontend](./ARQUITECTURA_FRONTEND.md)** - Estructura detallada de la aplicación React
- **[Arquitectura Backend](./ARQUITECTURA_BACKEND.md)** - Diseño de la API REST y base de datos

## 📚 Documentación y Tutoriales

Este proyecto incluye documentación detallada para aprender paso a paso:

1. **[TypeScript y Componentes](./1_TYPESCRIPT_Y_COMPONENTES.md)** - Aprende a configurar TypeScript en React y crear componentes reutilizables
2. **[Backend para TypeScript](./2_BACKEND_PARA_TYPESCRIPT.md)** - Cómo crear un backend Express que funcione con TypeScript
3. **[Navegación con React Router](./3_NAVEGACION_REACT_ROUTER.md)** - Implementa navegación entre páginas con React Router
4. **[Docker y PostgreSQL](./4_DOCKER_POSTGRES_TUTORIAL.md)** - Tutorial para migrar de memoria a base de datos PostgreSQL con Docker
5. **[Autentificación Supabase](./5_AUTENTICACION_SUPABASE.md)** - Tutorial para implementar Auth con Supabase
6. **[Crear una Landing Page](./6_LANDING_PAGE.md)** - Implementar una Landing Page para el usuario
7. **[Añadir Google Auth con Supabase](./7_AUTENTICACION_GOOGLE.md)** - Integrar Google Auth provider con Supabase

## 🚀 Características Principales

- **Gestión de Clientes**: CRUD completo para administrar información de clientes
- **Gestión de Dietas**: Crear y asignar planes nutricionales personalizados
- **Gestión de Rutinas**: Diseñar y organizar programas de entrenamiento
- **Catálogo de Productos**: Administrar productos fitness y suplementos
- **Interfaz Moderna**: UI responsive y amigable con React
- **API RESTful**: Backend robusto con Express.js
- **TypeScript**: Código tipado para mayor seguridad y mantenibilidad

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5.8.3** - JavaScript con tipos estáticos
- **Vite 6.3.5** - Herramienta de build ultrarrápida
- **React Router DOM 7.6.2** - Enrutamiento del lado del cliente
- **Material-UI v7** - Componentes de UI modernos
- **Supabase Client** - Cliente para base de datos
- **ApexCharts** - Visualización de datos
- **ESLint** - Linter para mantener calidad del código

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js 5.1.0** - Framework web minimalista
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos relacional (gestionada por Supabase)
- **CORS** - Middleware para peticiones cross-origin
- **Nodemon** - Herramienta de desarrollo con auto-restart

### Infraestructura
- **Supabase** - BaaS que proporciona PostgreSQL, Auth y APIs
- **Docker** - Opcional para desarrollo local

## 📁 Estructura del Proyecto

```
RepoEjemplo/
├── backend/                    # Servidor API Node.js/Express
│   ├── index.js               # Archivo principal del servidor
│   ├── database/              # Configuración de base de datos
│   │   ├── connection.js      # Conexión a Supabase
│   │   └── schema.sql         # Esquema de base de datos PostgreSQL
│   ├── routes/                # Endpoints de la API
│   │   ├── users.js           # Rutas de gestión de usuarios
│   │   ├── diets.js           # Rutas de gestión de dietas
│   │   ├── workouts.js        # Rutas de gestión de rutinas
│   │   ├── exercises.js       # Rutas de ejercicios
│   │   ├── foods.js           # Rutas de alimentos
│   │   └── products.js        # Rutas de productos
│   └── package.json           # Dependencias del backend
│
├── frontend/                   # Aplicación React/TypeScript
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── User/          # Componentes de usuarios
│   │   │   ├── Diet/          # Componentes de dietas
│   │   │   ├── Product/       # Componentes de productos
│   │   │   ├── Workout/       # Componentes de rutinas
│   │   │   └── common/        # Componentes compartidos
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Capa de servicios API
│   │   ├── types/             # Definiciones de tipos TypeScript
│   │   ├── layouts/           # Layouts (dashboard, auth)
│   │   ├── utils/             # Utilidades y hooks
│   │   └── main.tsx           # Punto de entrada de la app
│   └── vite.config.ts         # Configuración de Vite
│
├── docker-compose.yml         # Configuración de Docker
└── Documentación              # Archivos de tutorial y guías
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn
- Git
- Cuenta en Supabase (para base de datos y autenticación)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd RepoEjemplo
```

2. **Configurar Base de Datos en Supabase**

- Crear proyecto en [Supabase](https://supabase.com)
- Ejecutar el script `backend/database/schema.sql` en el SQL Editor
- Copiar las credenciales (URL y API Key)

3. **Configurar Variables de Entorno**

Crear archivo `.env` en la raíz:
```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_key
```

4. **Configurar el Backend**

Abrir terminal 1:
```bash
cd backend
npm install
npm run dev
```
El servidor estará disponible en `http://localhost:3001`

5. **Configurar el Frontend**

Abrir terminal 2:
```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

## 📚 Documentación de la API

### Endpoints Disponibles

#### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario específico
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario existente
- `DELETE /api/users/:id` - Eliminar usuario

#### Dietas
- `GET /api/diets` - Obtener todas las dietas
- `GET /api/diets/:id` - Obtener una dieta específica
- `POST /api/diets` - Crear nueva dieta
- `PUT /api/diets/:id` - Actualizar dieta existente
- `DELETE /api/diets/:id` - Eliminar dieta
- `POST /api/diets/:id/foods` - Agregar alimentos a dieta
- `POST /api/diets/:id/assign` - Asignar dieta a usuario

#### Rutinas
- `GET /api/workouts` - Obtener todas las rutinas
- `GET /api/workouts/:id` - Obtener una rutina específica
- `POST /api/workouts` - Crear nueva rutina
- `PUT /api/workouts/:id` - Actualizar rutina existente
- `DELETE /api/workouts/:id` - Eliminar rutina
- `POST /api/workouts/:id/exercises` - Agregar ejercicios a rutina

#### Ejercicios
- `GET /api/exercises` - Obtener todos los ejercicios
- `GET /api/exercises/:id` - Obtener un ejercicio específico
- `POST /api/exercises` - Crear nuevo ejercicio
- `PUT /api/exercises/:id` - Actualizar ejercicio
- `DELETE /api/exercises/:id` - Eliminar ejercicio

#### Alimentos
- `GET /api/foods` - Obtener todos los alimentos
- `GET /api/foods/:id` - Obtener un alimento específico
- `POST /api/foods` - Crear nuevo alimento
- `PUT /api/foods/:id` - Actualizar alimento
- `DELETE /api/foods/:id` - Eliminar alimento

#### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto específico
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto existente
- `DELETE /api/products/:id` - Eliminar producto

## 🎯 Funcionalidades por Módulo

### Módulo de Usuarios
- Gestión completa de usuarios (CRUD)
- Roles de usuario (admin/cliente)
- Autenticación con Supabase
- Perfil personalizado
- Asignación de dietas y rutinas

### Módulo de Dietas
- Creación de planes nutricionales personalizados
- Gestión de alimentos con información calórica
- Relación dieta-alimentos con cantidades
- Asignación de dietas a usuarios
- Exportación de planes (PDF, Excel, CSV)

### Módulo de Rutinas
- Diseño de programas de entrenamiento
- Biblioteca de ejercicios con tiempos
- Gestión de series y repeticiones
- Categorización de workouts
- Notas personalizadas

### Módulo de Productos
- Catálogo de productos fitness
- Gestión de precios
- Descripción detallada
- Interfaz de administración

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev     # Inicia el servidor con nodemon
```

### Frontend
```bash
npm run dev     # Inicia el servidor de desarrollo
```
