const express = require('express')
const router = express.Router()
const { supabase } = require('../database/supabaseClient')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ejercicios' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar ejercicio' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, description, execution_time } = req.body;
    console.log('📤 Body recibido:', { name, description, execution_time });

    if (!name || execution_time == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const { data, error } = await supabase
      .from('exercises')
      .insert([{ name, description, execution_time }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear ejercicio' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, execution_time } = req.body

    const { data, error } = await supabase
      .from('exercises')
      .update({ name, description, execution_time })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar ejercicio' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Ejercicio no encontrado' })
    res.json({ message: `Ejercicio "${data.name}" eliminado correctamente` })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' })
  }
})

module.exports = router
