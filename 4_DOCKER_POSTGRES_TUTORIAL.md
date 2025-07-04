# 🐘 Tutorial: Añadir PostgreSQL con Docker

Este tutorial te guiará paso a paso para transformar el backend de almacenamiento en memoria a una base de datos PostgreSQL real usando Docker.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Node.js instalado
- El proyecto actual funcionando

## 🚀 Paso 1: Configurar Docker y PostgreSQL

### 1.1 Crear archivo docker-compose.yml

En la raíz del proyecto (RepoEjemplo), crea un archivo `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15
    container_name: fitness-db
    environment:
      POSTGRES_USER: fitness_user
      POSTGRES_PASSWORD: fitness_pass
      POSTGRES_DB: fitness_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 1.2 Iniciar la base de datos

```bash
# En la raíz del proyecto
docker-compose up -d
```

## 🗃️ Paso 2: Crear las tablas en PostgreSQL

### 2.1 Crear archivo de esquema

Crea un archivo `backend/database/schema.sql`:

```sql
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'client'
);

-- Tabla de ejercicios (crear primero por las relaciones)
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    execution_time INTEGER
);

-- Tabla de rutinas (workouts)
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    notes TEXT
);

-- Tabla intermedia para la relación muchos a muchos
CREATE TABLE IF NOT EXISTS workouts_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    sets INTEGER,
    reps INTEGER,
    UNIQUE(workout_id, exercise_id)
);

-- Tabla de dietas
CREATE TABLE IF NOT EXISTS diets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    kcal VARCHAR(50)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2)
);

-- Tabla de clientes (la que ya teníamos)
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    objetivo TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.2 Ejecutar el esquema

```bash
# Conectar a la base de datos y ejecutar el SQL
docker exec -i fitness-db psql -U fitness_user -d fitness_db < backend/database/schema.sql
```

## 🔧 Paso 3: Instalar dependencias en el backend

```bash
cd backend
npm install pg dotenv
```

## 🔌 Paso 4: Configurar la conexión a la base de datos

### 4.1 Crear archivo .env

En la carpeta `backend`, crea un archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=fitness_user
DB_PASSWORD=fitness_pass
DB_NAME=fitness_db
```

### 4.2 Crear módulo de conexión

Crea el archivo `backend/database/db.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado a PostgreSQL');
    release();
  }
});

module.exports = pool;
```

## 📝 Paso 5: Actualizar las rutas para usar la base de datos

### 5.1 Actualizar routes/clients.js

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../database/db');

/**
 * GET all clients from database
 */
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/clients - Obteniendo todos los clientes');
    const result = await pool.query('SELECT * FROM clients ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

/**
 * GET client by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/clients/${id} - Buscando cliente`);
    
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log(`Cliente con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al buscar cliente' });
  }
});

/**
 * CREATE new client
 */
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/clients - Creando nuevo cliente');
    const { nombre, email, telefono, objetivo } = req.body;
    
    // Validate required fields
    if (!nombre || !email || !telefono || !objetivo) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const result = await pool.query(
      'INSERT INTO clients (nombre, email, telefono, objetivo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, telefono, objetivo]
    );
    
    console.log(`Cliente creado: ${result.rows[0].nombre} (ID: ${result.rows[0].id})`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'El email ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }
});

/**
 * UPDATE client
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /api/clients/${id} - Actualizando cliente`);
    const { nombre, email, telefono, objetivo } = req.body;
    
    // Validate required fields
    if (!nombre || !email || !telefono || !objetivo) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const result = await pool.query(
      'UPDATE clients SET nombre = $1, email = $2, telefono = $3, objetivo = $4 WHERE id = $5 RETURNING *',
      [nombre, email, telefono, objetivo, id]
    );
    
    if (result.rows.length === 0) {
      console.log(`Cliente con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    console.log(`Cliente actualizado: ${nombre}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

/**
 * DELETE client
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/clients/${id} - Eliminando cliente`);
    
    const result = await pool.query(
      'DELETE FROM clients WHERE id = $1 RETURNING nombre',
      [id]
    );
    
    if (result.rows.length === 0) {
      console.log(`Cliente con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    console.log(`Cliente eliminado: ${result.rows[0].nombre}`);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
```

## 🆕 Paso 6: Crear rutas para las nuevas entidades

### 6.1 Ejemplo: routes/users.js

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, surname, birth_date, created_at, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// CREATE new user
router.post('/', async (req, res) => {
  try {
    const { email, password, name, surname, birth_date, role } = req.body;
    
    const result = await pool.query(
      'INSERT INTO users (email, password, name, surname, birth_date, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, surname, birth_date, created_at, role',
      [email, password, name, surname, birth_date, role || 'client']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

module.exports = router;
```

### 6.2 Actualizar index.js para incluir nuevas rutas

```javascript
// En backend/index.js, añadir:
const usersRouter = require('./routes/users');

// Y luego:
app.use('/api/users', usersRouter);
```

## 🧪 Paso 7: Probar la aplicación

1. Asegúrate de que Docker está ejecutándose:
```bash
docker-compose ps
```

2. Reinicia el backend:
```bash
cd backend
npm run dev
```

3. La aplicación ahora usará PostgreSQL en lugar de memoria.

## 📚 Comandos útiles de Docker

```bash
# Ver logs de la base de datos
docker-compose logs postgres

# Conectar a PostgreSQL directamente
docker exec -it fitness-db psql -U fitness_user -d fitness_db

# Detener la base de datos
docker-compose down

# Detener y eliminar todos los datos
docker-compose down -v
```

## 💡 Ejemplo: Trabajar con relaciones muchos a muchos

### Crear ruta para obtener workout con sus ejercicios

```javascript
// routes/workouts.js
const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET workout with exercises
router.get('/:id/exercises', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the workout
    const workoutResult = await pool.query(
      'SELECT * FROM workouts WHERE id = $1',
      [id]
    );
    
    if (workoutResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workout no encontrado' });
    }
    
    // Then get all exercises for this workout
    const exercisesResult = await pool.query(`
      SELECT e.*, we.sets, we.reps
      FROM exercises e
      JOIN workouts_exercises we ON e.id = we.exercise_id
      WHERE we.workout_id = $1
      ORDER BY we.id
    `, [id]);
    
    const workout = workoutResult.rows[0];
    workout.exerciseList = exercisesResult.rows;
    
    res.json(workout);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener workout' });
  }
});

// POST add exercise to workout
router.post('/:workoutId/exercises', async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseId, sets, reps } = req.body;
    
    const result = await pool.query(
      'INSERT INTO workouts_exercises (workout_id, exercise_id, sets, reps) VALUES ($1, $2, $3, $4) RETURNING *',
      [workoutId, exerciseId, sets, reps]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Este ejercicio ya está en la rutina' });
    } else {
      res.status(500).json({ error: 'Error al añadir ejercicio' });
    }
  }
});

module.exports = router;
```

## 🎯 Ejercicios para practicar

1. **Básico**: Implementa las rutas CRUD para Products
2. **Intermedio**: Crea las rutas para Workouts y Exercises con su relación muchos a muchos
3. **Avanzado**: Implementa autenticación con JWT para Users

## 🔍 Consejos

- Usa `try-catch` en todas las operaciones async
- Maneja errores específicos de PostgreSQL (como duplicados)
- Usa transacciones para operaciones múltiples
- Nunca guardes contraseñas en texto plano (usa bcrypt)
- Mantén las credenciales en archivos .env (nunca en el código)

## 📖 Recursos adicionales

- [Documentación de node-postgres](https://node-postgres.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Docker Compose docs](https://docs.docker.com/compose/)