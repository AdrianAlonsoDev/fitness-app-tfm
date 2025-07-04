# Tutorial: Implementar Tests para tu API Backend

## 🎯 Objetivo
Aprender a implementar tests automatizados para tu API REST con Express y Supabase, siguiendo las mejores prácticas y manteniendo la simplicidad.

## 📋 ¿Qué vamos a hacer?
- Configurar Jest y Supertest para testing
- Crear tests para rutas de autenticación
- Implementar tests para operaciones CRUD
- Mockear Supabase para evitar dependencias de base de datos
- Establecer patrones reutilizables para futuros tests

## 🚀 Implementación Paso a Paso

### Paso 1: Instalar Dependencias de Testing

Primero, instalamos las herramientas necesarias:

```bash
cd backend
npm install --save-dev jest supertest
```

**¿Qué hace cada una?**
- **Jest**: Framework de testing más popular para JavaScript
- **Supertest**: Permite hacer peticiones HTTP a tu API para testing

### Paso 2: Configurar Jest

Creamos un archivo de configuración para Jest:

**backend/jest.config.js**
```javascript
module.exports = {
  // Configura Jest para ejecutar en ambiente Node.js (no navegador)
  testEnvironment: 'node',
  
  // Ignora node_modules al calcular cobertura de código
  coveragePathIgnorePatterns: ['/node_modules/'],
  
  // Busca archivos de test con extensión .test.js en carpeta tests
  testMatch: ['**/tests/**/*.test.js'],
  
  // Archivos a incluir en el reporte de cobertura
  collectCoverageFrom: [
    'routes/**/*.js',       // Incluye todas las rutas
    'middleware/**/*.js',   // Incluye todos los middlewares
    '!**/node_modules/**'   // Excluye node_modules
  ],
  
  // Muestra detalles de cada test mientras se ejecuta
  verbose: true,
  
  // Archivo que se ejecuta antes de cada suite de tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

### Paso 3: Crear Setup Global para Tests

**backend/tests/setup.js**
```javascript
// Configurar variables de entorno para tests
// Estas son falsas y solo se usan para que el código no falle al iniciar
process.env.JWT_SECRET = 'test-secret';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
```

### Paso 4: Actualizar package.json

Modificamos los scripts para ejecutar tests:

**backend/package.json**
```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Paso 5: Crear Test para Middleware de Autenticación

Empezamos con el middleware más importante - la autenticación:

**backend/tests/auth.test.js**
```javascript
const request = require('supertest');
const express = require('express');

// Mock Supabase antes de importar el middleware
// Esto es CRÍTICO: debe estar antes de cualquier import que use Supabase
jest.mock('../database/supabaseClient', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn()  // Simula el método getUser de Supabase Auth
    },
    from: jest.fn()       // Simula el método from para queries de BD
  }
}));

// Ahora sí importamos (después del mock)
const { supabaseAdmin } = require('../database/supabaseClient');
const { authenticateToken } = require('../middleware/auth');

// Crear app de prueba minimalista
const app = express();
app.use(express.json());  // Para parsear JSON en requests

// Ruta de prueba que usa el middleware de autenticación
app.get('/test-auth', authenticateToken, (req, res) => {
  res.json({ message: 'Authenticated', user: req.user });
});

describe('Authentication Middleware', () => {
  // Limpia todos los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería retornar 401 cuando no hay token', async () => {
    // Hace petición sin header Authorization
    const res = await request(app)
      .get('/test-auth');
    
    // Verifica respuesta esperada
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Token de acceso requerido');
  });

  test('debería retornar 403 cuando el token es inválido', async () => {
    // Mock: Simula que Supabase no puede validar el token
    supabaseAdmin.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Invalid token')
    });

    // Hace petición con token inválido
    const res = await request(app)
      .get('/test-auth')
      .set('Authorization', 'Bearer invalidtoken');
    
    // Verifica que se rechace correctamente
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
  });

  test('debería permitir acceso con token válido', async () => {
    // Datos simulados del usuario autenticado
    const mockAuthUser = { 
      id: 'auth-123', 
      email: 'test@example.com'
    };
    
    // Datos simulados del usuario en la BD
    const mockDbUser = {
      id: 1,
      auth_user_id: 'auth-123',
      email: 'test@example.com',
      name: 'Test',
      role: 'client'
    };

    // Mock 1: Simula que el token es válido
    supabaseAdmin.auth.getUser.mockResolvedValue({
      data: { user: mockAuthUser },
      error: null
    });

    // Mock 2: Simula la búsqueda del usuario en la BD
    // Nota: mockReturnThis() permite encadenar métodos
    supabaseAdmin.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: mockDbUser,
        error: null
      })
    });

    // Hace petición con token válido
    const res = await request(app)
      .get('/test-auth')
      .set('Authorization', 'Bearer validtoken');
    
    // Verifica éxito
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Authenticated');
  });
});
```

### Paso 6: Crear Tests para Rutas de Dietas (Ejemplo CRUD)

Ahora creamos tests para las operaciones CRUD básicas:

**backend/tests/diets.test.js**
```javascript
const request = require('supertest');
const express = require('express');

// Mock de Supabase completo antes de importar
jest.mock('../database/supabaseClient', () => ({
  supabase: {
    from: jest.fn()  // Cliente normal para queries
  },
  supabaseAdmin: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn()  // Cliente admin (aunque no lo usamos aquí)
  }
}));

// Importar después del mock
const { supabase } = require('../database/supabaseClient');
const dietsRouter = require('../routes/diets');

// Crear app de prueba
const app = express();
app.use(express.json());

// Montar rutas SIN middleware de auth para simplificar tests
// En producción estas rutas estarían protegidas
app.use('/api/diets', dietsRouter);

describe('Diets API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/diets', () => {
    test('debería retornar lista de dietas exitosamente', async () => {
      // Datos de prueba
      const mockDiets = [
        { id: 1, name: 'Dieta Keto', description: 'Baja en carbohidratos', calories: 1800 },
        { id: 2, name: 'Dieta Mediterránea', description: 'Balanceada', calories: 2000 }
      ];

      // Mock de la cadena: supabase.from('diets').select('*').order('id')
      // Se construye de atrás hacia adelante
      const mockOrder = jest.fn().mockResolvedValue({
        data: mockDiets,
        error: null
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        order: mockOrder  // select() retorna objeto con método order()
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect  // from() retorna objeto con método select()
      });

      // Ejecutar petición
      const res = await request(app)
        .get('/api/diets');

      // Verificar respuesta
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockDiets);
      expect(supabase.from).toHaveBeenCalledWith('diets');
    });

    test('debería retornar 500 en error de base de datos', async () => {
      // Simula un error de Supabase
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Database connection failed')
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        order: mockOrder
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect
      });

      // Ejecutar petición
      const res = await request(app)
        .get('/api/diets');

      // Verificar manejo de error
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Error al obtener dietas');
    });
  });

  describe('GET /api/diets/:id', () => {
    test('debería retornar una dieta específica cuando existe', async () => {
      const mockDiet = { 
        id: 1, 
        name: 'Dieta Keto', 
        description: 'Baja en carbohidratos', 
        calories: 1800 
      };

      // Mock: supabase.from('diets').select('*').eq('id', id).single()
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockDiet,
        error: null
      });
      
      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle  // eq() retorna objeto con single()
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq  // select() retorna objeto con eq()
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect  // from() retorna objeto con select()
      });

      // Petición con ID específico
      const res = await request(app)
        .get('/api/diets/1');

      // Verificar que retorna la dieta correcta
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockDiet);
    });

    test('debería retornar 404 cuando la dieta no existe', async () => {
      // Mock para no encontrado
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null
      });
      
      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect
      });

      const res = await request(app)
        .get('/api/diets/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Dieta no encontrada');
    });
  });

  describe('POST /api/diets', () => {
    test('debería crear una nueva dieta con datos válidos', async () => {
      // Datos de la nueva dieta
      const newDiet = {
        name: 'Dieta Vegana',
        description: 'Basada en plantas',
        calories: 1900
      };

      // Respuesta simulada (incluye ID generado)
      const createdDiet = { id: 3, ...newDiet };

      // Mock: supabase.from('diets').insert([dietData]).select().single()
      const mockSingle = jest.fn().mockResolvedValue({
        data: createdDiet,
        error: null
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle  // select() retorna objeto con single()
      });
      
      const mockInsert = jest.fn().mockReturnValue({
        select: mockSelect  // insert() retorna objeto con select()
      });
      
      supabase.from.mockReturnValue({
        insert: mockInsert  // from() retorna objeto con insert()
      });

      // Enviar petición POST con datos
      const res = await request(app)
        .post('/api/diets')
        .send(newDiet);

      // Verificar creación exitosa
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdDiet);
    });

    test('debería retornar 400 cuando faltan campos requeridos', async () => {
      const incompleteDiet = {
        name: 'Dieta Test'
        // Faltan description y calories - campos obligatorios
      };

      // No necesitamos mock - la validación ocurre antes
      const res = await request(app)
        .post('/api/diets')
        .send(incompleteDiet);

      // Verifica que se rechace por validación
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Faltan campos requeridos');
    });
  });

  describe('PUT /api/diets/:id', () => {
    test('debería actualizar una dieta con datos válidos', async () => {
      // Datos para actualizar
      const updateData = {
        name: 'Dieta Actualizada',
        description: 'Descripción actualizada',
        calories: 2100
      };

      // Respuesta simulada después de actualizar
      const updatedDiet = { id: 1, ...updateData };

      // Mock: supabase.from('diets').update(updateData).eq('id', id).select().single()
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedDiet,
        error: null
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle  // select() retorna objeto con single()
      });
      
      const mockEq = jest.fn().mockReturnValue({
        select: mockSelect  // eq() retorna objeto con select()
      });
      
      const mockUpdate = jest.fn().mockReturnValue({
        eq: mockEq  // update() retorna objeto con eq()
      });
      
      supabase.from.mockReturnValue({
        update: mockUpdate  // from() retorna objeto con update()
      });

      // Enviar petición PUT
      const res = await request(app)
        .put('/api/diets/1')
        .send(updateData);

      // Verificar actualización exitosa
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedDiet);
    });
  });

  describe('DELETE /api/diets/:id', () => {
    test('debería eliminar una dieta exitosamente', async () => {
      // Mock: supabase.from('diets').delete().eq('id', id).select('name').single()
      const mockSingle = jest.fn().mockResolvedValue({
        data: { name: 'Dieta Eliminada' },  // Solo retorna el nombre
        error: null
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle  // select() retorna objeto con single()
      });
      
      const mockEq = jest.fn().mockReturnValue({
        select: mockSelect  // eq() retorna objeto con select()
      });
      
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq  // delete() retorna objeto con eq()
      });
      
      supabase.from.mockReturnValue({
        delete: mockDelete  // from() retorna objeto con delete()
      });

      // Enviar petición DELETE
      const res = await request(app)
        .delete('/api/diets/1');

      // Verificar eliminación exitosa
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Dieta eliminada correctamente');
    });
  });
});
```

### Paso 7: Crear Tests para Usuarios (Patrón Reutilizable)

Aplicamos el mismo patrón para otra entidad:

**backend/tests/users.test.js**
```javascript
const request = require('supertest');
const express = require('express');

// Mock todo antes de importar
jest.mock('../database/supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  },
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: jest.fn()  // Para crear usuarios en Supabase Auth
      }
    },
    from: jest.fn()
  }
}));

// Importar después del mock
const { supabase, supabaseAdmin } = require('../database/supabaseClient');
const usersRouter = require('../routes/users');

// Crear app de prueba
const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('Users API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    test('debería retornar lista de usuarios exitosamente', async () => {
      const mockUsers = [
        { id: 1, name: 'Juan', surname: 'Pérez', email: 'juan@example.com', role: 'client' },
        { id: 2, name: 'María', surname: 'García', email: 'maria@example.com', role: 'trainer' }
      ];

      // Mock de la cadena completa
      const mockOrder = jest.fn().mockResolvedValue({
        data: mockUsers,
        error: null
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        order: mockOrder
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect
      });

      const res = await request(app)
        .get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });
  });

  describe('POST /api/users', () => {
    test('debería crear un nuevo usuario con datos válidos', async () => {
      // Datos del nuevo usuario
      const newUser = {
        name: 'Carlos',
        surname: 'López',
        email: 'carlos@example.com',
        password: 'password123',
        birth_date: '1990-01-01'
      };

      // Respuesta simulada de Supabase Auth
      const mockAuthUser = {
        user: { id: 'auth-789', email: 'carlos@example.com' }
      };

      // Usuario creado en la BD (incluye auth_user_id)
      const createdUser = { 
        id: 3, 
        auth_user_id: 'auth-789',
        name: 'Carlos',
        surname: 'López',
        email: 'carlos@example.com',
        birth_date: '1990-01-01',
        role: 'client'  // Por defecto es 'client'
      };

      // Mock 1: Crear usuario en Supabase Auth
      supabaseAdmin.auth.admin.createUser.mockResolvedValue({
        data: mockAuthUser,
        error: null
      });

      // Mock 2: Buscar el usuario creado en la BD
      const mockSingle = jest.fn().mockResolvedValue({
        data: createdUser,
        error: null
      });
      
      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle
      });
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq
      });
      
      supabase.from.mockReturnValue({
        select: mockSelect
      });

      // Enviar petición POST
      const res = await request(app)
        .post('/api/users')
        .send(newUser);

      // Verificar creación exitosa
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        name: 'Carlos',
        email: 'carlos@example.com'
      });
    });

    test('debería retornar 400 cuando faltan campos requeridos', async () => {
      const incompleteUser = {
        name: 'Test User'
        // Faltan email, password, birth_date
      };

      const res = await request(app)
        .post('/api/users')
        .send(incompleteUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Faltan campos requeridos (email, password, name, surname, birth_date)');
    });

    test('debería retornar 500 para email duplicado', async () => {
      // Pista: Cuando createUser falla, el error se propaga como 500
      // No como 400 como podrías esperar
      // Mock: supabaseAdmin.auth.admin.createUser con error
    });
  });

  // TODO: Completar tests PUT y DELETE
  describe('PUT /api/users/:id', () => {
    test('debería actualizar un usuario con datos válidos', async () => {
      // Pista: Similar a PUT de dietas pero...
      // IMPORTANTE: La ruta de usuarios permite actualizaciones parciales
      // No valida campos requeridos en PUT como lo hace en POST
    });

    test('debería manejar actualizaciones parciales', async () => {
      // Pista: Puedes enviar solo { name: 'Nuevo Nombre' }
      // La implementación actual NO retorna 400 por campos faltantes
      // Simplemente actualiza los campos enviados
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('debería eliminar un usuario exitosamente', async () => {
      // Pista: El mensaje de éxito es diferente al de dietas
      // Formato: `Usuario ${data.email} eliminado correctamente`
      // Necesitas mockear select('email') para que retorne { email: 'test@example.com' }
    });

    test('debería retornar 404 cuando el usuario no existe', async () => {
      // Pista: Similar a dietas, pero verifica el mensaje de error específico
    });
  });
});
```

### Paso 8: Ejecutar los Tests

Ahora podemos ejecutar nuestros tests:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage

# Ejecutar un archivo específico
npm test -- tests/diets.test.js
```

## 🎨 Mejores Prácticas

### 1. Estructura Clara
```
backend/
├── tests/
│   ├── setup.js           # Configuración global
│   ├── auth.test.js       # Tests de autenticación
│   ├── diets.test.js      # Tests de dietas
│   └── users.test.js      # Tests de usuarios
```

### 2. Patrón de Mockeo Consistente
```javascript
// SIEMPRE mockear ANTES de importar
// Jest reemplaza el módulo real con el mock
jest.mock('../database/supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}));

// DESPUÉS importar (ya está mockeado)
const { supabase } = require('../database/supabaseClient');
```

### 3. Tests Descriptivos
```javascript
describe('Entidad API Routes', () => {
  describe('GET /api/entidad', () => {
    test('debería hacer X cuando Y', async () => {
      // Arrange - Preparar datos y mocks
      const mockData = { /* ... */ };
      
      // Act - Ejecutar la acción
      const res = await request(app).get('/api/entidad');
      
      // Assert - Verificar resultados
      expect(res.statusCode).toBe(200);
    });
  });
});
```

### 4. Mockear Cadenas Completas de Supabase
```javascript
// Mock correcto para: supabase.from('tabla').select('*').order('id')
// Se construye de atrás hacia adelante:
const mockOrder = jest.fn().mockResolvedValue({ data: mockData, error: null });
const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
supabase.from.mockReturnValue({ select: mockSelect });

// Cada método debe retornar un objeto con el siguiente método en la cadena
```

## 🚨 Errores Comunes y Soluciones

### Error: "Cannot read property 'order' of undefined"
**Causa**: No se mockeó completamente la cadena de métodos de Supabase.
**Solución**: Asegurar que cada método en la cadena retorne un objeto con el siguiente método.

### Error: Tests retornan 500 en lugar del código esperado
**Causa**: Error en el mockeo que causa una excepción no manejada.
**Solución**: Verificar que todos los métodos de la cadena estén mockeados correctamente.

### Error: "Error interno del servidor" en lugar del mensaje esperado
**Causa**: El middleware de autenticación puede estar interceptando el error.
**Solución**: Montar las rutas sin middleware para tests unitarios simples.

### Error: Mensajes de error no coinciden con los esperados
**Causa**: Los mensajes exactos pueden variar entre rutas.
**Solución**: Siempre verificar los mensajes reales en el código fuente:
```javascript
// ❌ MAL: Asumir que todos usan el mismo mensaje
expect(res.body).toHaveProperty('error', 'Todos los campos son requeridos');

// ✅ BIEN: Verificar el mensaje exacto en la ruta
// Revisar en routes/users.js línea 67:
// 'Faltan campos requeridos (email, password, name, surname, birth_date)'
expect(res.body).toHaveProperty('error', 'Faltan campos requeridos (email, password, name, surname, birth_date)');
```

### Error: DELETE retorna mensaje incorrecto
**Causa**: Diferentes entidades formatean sus mensajes de manera distinta.
**Solución**: Revisar qué campos se seleccionan en el DELETE:
```javascript
// Dietas: select('name') → "Dieta eliminada correctamente"
// Usuarios: select('email') → "Usuario ${email} eliminado correctamente"
// El mensaje depende de lo que retorna el select() en cada ruta
```

## 📚 Recursos Adicionales

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de Supertest](https://github.com/ladjs/supertest)
- [Testing en Node.js - Mejores Prácticas](https://github.com/goldbergyoni/nodebestpractices#4-testing-and-overall-quality-practices)

## ✅ Checklist Final

- [ ] Dependencias instaladas (jest, supertest)
- [ ] Configuración de Jest creada
- [ ] Variables de entorno configuradas para tests
- [ ] Scripts de test en package.json
- [ ] Tests de autenticación funcionando
- [ ] Tests CRUD para al menos una entidad
- [ ] Patrón reutilizable establecido
- [ ] Tests ejecutándose exitosamente
