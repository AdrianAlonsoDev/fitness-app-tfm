const eexpress = require('express')
const router = eexpress.Router()
const { supabase } = require('../database/supabaseClient')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workout_exercises')
      .select('*')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error al obtener datos de workout_exercises' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('workout_exercises')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar workout_exercise' })
  }
})

router.post('/', async (req, res) => {
  try {
    const exercises = Array.isArray(req.body) ? req.body : [req.body];

    if (
      !exercises.every(
        (ex) =>
          ex.workout_id != null &&
          ex.exercise_id != null &&
          ex.sets != null &&
          ex.reps != null
      )
    ) {
      return res
        .status(400)
        .json({ error: 'Faltan campos requeridos en uno o más ejercicios' });
    }

    const { data, error } = await supabase
      .from('workout_exercises')
      .insert(exercises)
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('❌ Error guardando ejercicios:', err);
    res.status(500).json({ error: 'Error al guardar ejercicios del entrenamiento' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { sets, reps } = req.body

    const { data, error } = await supabase
      .from('workout_exercises')
      .update({ sets, reps })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar workout_exercise' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ message: 'Registro eliminado correctamente', deleted: data })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar workout_exercise' })
  }
})

router.delete('/workout/:workoutId', async (req, res) => {
  const { workoutId } = req.params;

  try {
    const { error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', workoutId);

    if (error) throw error;

    res.status(204).end();
  } catch (err) {
    console.error('❌ Error al eliminar ejercicios del entrenamiento:', err);
    res.status(500).json({ error: 'No se pudieron eliminar los ejercicios' });
  }
});

module.exports = router
