
require('dotenv').config();

const express = require('express')
const cors = require('cors')
const { authenticateToken } = require('./middleware/auth')
const usersRouter = require('./routes/users')
const dietsRouter = require('./routes/diets')
const workoutsRouter = require('./routes/workouts')
const exercisesRouter = require('./routes/exercises')
const workoutsExercisesRouter = require('./routes/workouts_exercises')
const ecommerceRouter = require('./routes/ecommerce')
const foodsRouter = require('./routes/foods')
const dietFoodsRouter = require('./routes/diet_foods')


const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`)
  next()
})


// Rutas públicas (no requieren autenticación)
app.use('/api/users', usersRouter)
app.use('/api/diets', authenticateToken, dietsRouter)
app.use('/api/workouts', authenticateToken, workoutsRouter)
app.use('/api/products', authenticateToken, ecommerceRouter)
app.use('/api/exercises', authenticateToken, exercisesRouter)
app.use('/api/workouts_exercises', authenticateToken, workoutsExercisesRouter)
app.use('/api/foods', authenticateToken, foodsRouter)
app.use('/api/diet_foods', authenticateToken, dietFoodsRouter)


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
  console.log('Endpoints disponibles:')
  console.log('  - /api/users')
  console.log('  - /api/diets')
  console.log('  - /api/workouts')
  console.log('  - /api/products')
  console.log('  - /api/exercises')
  console.log('  - /api/workouts_exercises')
  console.log('  - /api/foods')
  console.log('  - /api/diet_foods')
})

