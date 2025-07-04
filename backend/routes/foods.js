const express = require('express')
const router = express.Router()
const { supabase } = require('../database/supabaseClient')

// Obtener todos los alimentos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alimentos' })
  }
})

// Crear alimento
router.post('/', async (req, res) => {
  try {
    console.log('📝 Backend: Creando alimento con datos:', req.body);
    
    const { name, description, calories } = req.body;
    
    console.log('📝 Campos recibidos:', { name, description, calories });
    console.log('📝 Tipos:', { 
      name: typeof name, 
      description: typeof description, 
      calories: typeof calories 
    });
    
    if (!name || !description || calories == null) {
      console.error('❌ Faltan campos:', { name: !!name, description: !!description, calories: calories != null });
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        received: { name, description, calories },
        missing: {
          name: !name,
          description: !description,
          calories: calories == null
        }
      });
    }
    
    const { data, error } = await supabase
      .from('foods')
      .insert([{ name, description, calories }])
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Alimento creado:', data);
    res.status(201).json(data);
  } catch (err) {
    console.error('❌ Error al crear alimento:', err);
    res.status(500).json({ error: 'Error al crear alimento', details: err.message });
  }
})

// Actualizar alimento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, calories } = req.body
    const { data, error } = await supabase
      .from('foods')
      .update({ name, description, calories })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar alimento' })
  }
})

// Eliminar alimento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id)
      .select('name')
      .single()
    if (error) throw error
    res.json({ message: `Alimento "${data.name}" eliminado correctamente` })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar alimento' })
  }
})

module.exports = router