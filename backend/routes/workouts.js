const express = require('express')
const router = express.Router()
const { supabase } = require('../database/supabaseClient')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener entrenamientos' })
  }
})

router.get('/with-exercises', async (req, res) => {
  try {
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          id,
          sets,
          reps,
          exercises (
            id,
            name,
            description,
            execution_time
          )
        )
      `)
      .order('id')

    if (workoutsError) throw workoutsError
    res.json(workouts)
  } catch (err) {
    console.error('Error al obtener entrenamientos con ejercicios:', err)
    res
      .status(500)
      .json({ error: 'Error al obtener entrenamientos con ejercicios' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data)
      return res.status(404).json({ error: 'Entrenamiento no encontrado' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar entrenamiento' })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log('📦 Body recibido en POST /workouts:', req.body)
    const { user_id, name, category, notes } = req.body

    if (!user_id || !name || !category) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    const { data, error } = await supabase
      .from('workouts')
      .insert([{ user_id, name, category, notes }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (err) {
    console.error('🔥 Error en POST /workouts:', err)
    res.status(500).json({ error: 'Error al crear entrenamiento' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, notes } = req.body

    const { data, error } = await supabase
      .from('workouts')
      .update({ name, category, notes })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar entrenamiento' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Backend: Eliminando entrenamiento ${id}`);
    
    // Primero eliminar todos los ejercicios asociados al entrenamiento
    const { error: deleteExercisesError } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', id);
    
    if (deleteExercisesError) {
      console.error('❌ Error al eliminar ejercicios del entrenamiento:', deleteExercisesError);
      throw deleteExercisesError;
    }
    
    console.log('✅ Ejercicios del entrenamiento eliminados');
    
    // Luego eliminar el entrenamiento
    const { data, error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .select('name')
      .single();

    if (error) {
      console.error('❌ Error al eliminar entrenamiento:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    }
    
    console.log(`✅ Entrenamiento "${data.name}" eliminado correctamente`);
    res.json({
      message: `Entrenamiento "${data.name}" eliminado correctamente`
    });
  } catch (err) {
    console.error('❌ Error al eliminar entrenamiento:', err);
    res.status(500).json({ 
      error: 'Error al eliminar entrenamiento', 
      details: err.message 
    });
  }
})

router.get('/:id/full', async (req, res) => {
  try {
    const { id } = req.params

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single()

    if (workoutError) throw workoutError
    if (!workout)
      return res.status(404).json({ error: 'Entrenamiento no encontrado' })

    const { data: workoutExercises, error: weError } = await supabase
      .from('workout_exercises')
      .select(
        'id, sets, reps, exercises(id, name, description, execution_time)'
      )
      .eq('workout_id', id)

    if (weError) throw weError

    const exercises = workoutExercises.map((item) => ({
      link_id: item.id,
      sets: item.sets,
      reps: item.reps,
      id: item.exercises.id,
      name: item.exercises.name,
      description: item.exercises.description,
      execution_time: item.exercises.execution_time
    }))

    res.json({ ...workout, exercises })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Error al obtener el entrenamiento completo' })
  }
})

router.get('/:id/details', async (req, res) => {
  const { id } = req.params

  try {
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single()

    if (workoutError) throw workoutError

    const { data: exercises, error: exercisesError } = await supabase
      .from('workout_exercises')
      .select(`
        id,
        sets,
        reps,
        exercise_id,
        exercises:exercise_id (
          name,
          description,
          execution_time
        )
      `)
      .eq('workout_id', id)

    if (exercisesError) throw exercisesError

    const flattenedExercises = exercises.map((ex) => ({
      link_id: ex.id,
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps,
      name: ex.exercises.name,
      description: ex.exercises.description,
      execution_time: ex.exercises.execution_time
    }))

    res.json({
      ...workout,
      exercises: flattenedExercises
    })
  } catch (err) {
    console.error('Error cargando detalles del entrenamiento:', err)
    res.status(500).json({ error: 'Error cargando detalles del entrenamiento' })
  }
})


router.get('/:id/user', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Backend: Obteniendo usuario para workout ${id}`);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('user_id, users(id, name, surname, email)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase al obtener usuario:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Workout no encontrado' });
    }
    

    if (!data.user_id) {
      console.log(`👤 Workout ${id} no tiene usuario asignado`);
      return res.json(null);
    }
    
    console.log(`👤 Usuario del workout ${id}:`, data.users);
    res.json(data.users);
  } catch (error) {
    console.error('❌ Error al obtener usuario del workout:', error);
    res.status(500).json({ error: 'Error al obtener usuario del workout' });
  }
});


router.put('/:id/user/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    console.log(`🔄 Backend: Cambiando propietario del workout ${id} a usuario ${userId}`);
    
    const { data, error } = await supabase
      .from('workouts')
      .update({ user_id: userId })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Workout no encontrado' });
    }
    
    console.log('✅ Propietario cambiado correctamente:', data);
    res.json({ message: 'Propietario cambiado correctamente', data });
  } catch (error) {
    console.error('❌ Error al cambiar propietario del workout:', error);
    res.status(500).json({ error: 'Error al cambiar propietario del workout' });
  }
});


router.delete('/:id/user', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Backend: Quitando propietario del workout ${id}`);
    
    const { data, error } = await supabase
      .from('workouts')
      .update({ user_id: null })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Workout no encontrado' });
    }
    
    console.log('✅ Propietario quitado correctamente');
    res.json({ message: 'Propietario quitado correctamente' });
  } catch (error) {
    console.error('❌ Error al quitar propietario del workout:', error);
    res.status(500).json({ error: 'Error al quitar propietario del workout' });
  }
});


router.get('/:id/user', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👤 Backend: Obteniendo usuario propietario del workout ${id}`);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('user_id, users(id, name, surname, email)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase al obtener usuario:', error);
      throw error;
    }
    
    if (!data || !data.user_id) {
      return res.json(null); 
    }
    
    console.log('👤 Usuario propietario obtenido:', data.users);
    res.json(data.users);
  } catch (error) {
    console.error('❌ Error al obtener usuario del workout:', error);
    res.status(500).json({ error: 'Error al obtener usuario del workout' });
  }
});


router.put('/:id/user/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    console.log(`🔄 Backend: Cambiando propietario del workout ${id} al usuario ${userId}`);
    
    const { data, error } = await supabase
      .from('workouts')
      .update({ user_id: userId })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Workout no encontrado' });
    }
    
    console.log('✅ Propietario cambiado correctamente:', data);
    res.json({ message: 'Propietario cambiado correctamente', data });
  } catch (error) {
    console.error('❌ Error al cambiar propietario del workout:', error);
    res.status(500).json({ error: 'Error al cambiar propietario del workout' });
  }
});

module.exports = router
