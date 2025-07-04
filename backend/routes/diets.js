const express = require('express')
const router = express.Router()
const { supabase } = require('../database/supabaseClient')


// Obtener todas las dietas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diets')
      .select('*')
      .order('id')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener dietas' })
  }
})

// Obtener todas las dietas con sus alimentos y cantidades
router.get('/with-foods', async (req, res) => {
  try {
    console.log('📋 Backend: Obteniendo todas las dietas con alimentos...');
    
    // Primero obtenemos las dietas básicas
    const { data: diets, error: dietsError } = await supabase
      .from('diets')
      .select('*')
      .order('id');

    if (dietsError) {
      console.error('❌ Error obteniendo dietas:', dietsError);
      throw dietsError;
    }
    
    console.log(`✅ Backend: ${diets.length} dietas básicas obtenidas`);
    
    // Ahora obtenemos las dietas con alimentos usando una consulta separada
    const { data: dietsWithFoods, error: joinError } = await supabase
      .from('diets')
      .select(`
        *,
        diet_foods (
          id,
          quantity,
          food_id,
          foods (
            id,
            name,
            description,
            calories
          )
        )
      `)
      .order('id');

    if (joinError) {
      console.error('❌ Error en consulta con JOIN:', joinError);
      // Si falla la consulta con JOIN, devolvemos solo las dietas básicas
      const dietsOnly = diets.map(diet => ({
        ...diet,
        diet_foods: []
      }));
      console.log('⚠️ Devolviendo dietas sin alimentos');
      return res.json(dietsOnly);
    }
    
    console.log(`✅ Backend: ${dietsWithFoods.length} dietas con alimentos obtenidas`);
    res.json(dietsWithFoods);
  } catch (err) {
    console.error('❌ Error al obtener dietas con alimentos:', err);
    res.status(500).json({ 
      error: 'Error al obtener dietas con alimentos', 
      details: err.message,
      stack: err.stack 
    });
  }
})

// Obtener una dieta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('diets')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data)
      return res.status(404).json({ error: 'Dieta no encontrada' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar dieta' })
  }
})

// Crear una dieta
router.post('/', async (req, res) => {
  try {
    const { name, description, calories } = req.body;

    if (!name || !description || calories == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const { data, error } = await supabase
      .from('diets')
      .insert([{ name, description, calories }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear dieta' });
  }
})

// Actualizar una dieta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Backend: Actualizando dieta ${id} con datos:`, req.body);
    
    const { name, description, calories } = req.body;
    
    if (!name || !description || calories == null) {
      console.error('❌ Faltan campos requeridos:', { name: !!name, description: !!description, calories: calories != null });
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        received: { name, description, calories }
      });
    }
    
    const { data, error } = await supabase
      .from('diets')
      .update({ name, description, calories })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    if (!data) {
      console.warn(`⚠️ Dieta con ID ${id} no encontrada`);
      return res.status(404).json({ error: 'Dieta no encontrada' });
    }
    
    console.log('✅ Dieta actualizada:', data);
    res.json(data);
  } catch (error) {
    console.error('❌ Error al actualizar dieta:', error);
    res.status(500).json({ error: 'Error al actualizar dieta', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('diets').delete().eq('id', id).select('name').single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Dieta no encontrada' });
    res.json({ message: 'Dieta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar dieta' });
  }
});


router.get('/:id/users', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Backend: Obteniendo usuarios para dieta ${id}`);
    
    const { data, error } = await supabase
      .from('user_diets')
      .select('user_id, users(id, name, surname, email)')
      .eq('diet_id', id);
      
    if (error) {
      console.error('❌ Error en Supabase al obtener usuarios:', error);
      throw error;
    }
    
    const users = data.map(item => item.users);
    console.log(`👥 Usuarios obtenidos: ${users.length}`);
    console.log('📋 Datos:', users);
    
    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios de la dieta:', error);
    res.status(500).json({ error: 'Error al obtener usuarios de la dieta' });
  }
});


// Asignar usuario a dieta
router.post('/:id/users', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    console.log(`🔗 Backend: Asignando usuario ${userId} a dieta ${id}`);
  
    const { data, error } = await supabase
      .from('user_diets')
      .insert([{ diet_id: id, user_id: userId }])
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error en Supabase:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El usuario ya está asignado a esta dieta' });
      }
      throw error;
    }
    
    console.log('✅ Usuario asignado correctamente:', data);
    res.status(201).json({ message: 'Usuario asignado correctamente', data });
  } catch (error) {
    console.error('❌ Error al asignar usuario a la dieta:', error);
    res.status(500).json({ error: 'Error al asignar usuario a la dieta' });
  }
});



// Quitar usuario de dieta
router.delete('/:id/users/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    console.log(`🗑️ Backend: Quitando usuario ${userId} de dieta ${id}`);
    
    const { data, error } = await supabase
      .from('user_diets')
      .delete()
      .eq('diet_id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Relación usuario-dieta no encontrada' });
    }
    
    console.log('✅ Usuario quitado de la dieta correctamente:', data);
    res.json({ message: 'Usuario quitado de la dieta correctamente' });
  } catch (error) {
    console.error('❌ Error al quitar usuario de la dieta:', error);
    res.status(500).json({ error: 'Error al quitar usuario de la dieta' });
  }
});

// Obtener detalles de una dieta (con alimentos)
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Backend: Obteniendo detalles de dieta ${id}`);
    
    const { data, error } = await supabase
      .from('diets')
      .select(`
        *,
        diet_foods (
          id,
          quantity,
          food_id,
          foods (
            id,
            name,
            description,
            calories
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Dieta no encontrada' });
    }
    
    console.log('✅ Detalles de dieta obtenidos:', data);
    res.json(data);
  } catch (error) {
    console.error('❌ Error al obtener detalles de la dieta:', error);
    res.status(500).json({ error: 'Error al obtener detalles de la dieta', details: error.message });
  }
});

module.exports = router
