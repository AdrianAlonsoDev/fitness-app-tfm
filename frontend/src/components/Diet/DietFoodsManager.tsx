import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Stack, Typography,
  Box
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import * as foodService from '../../services/foodService';
import * as dietFoodService from '../../services/dietFoodService';
import { Food } from '../../types/Food';
import { DietFood } from '../../types/DietFood';
import { calculateFoodCalories, formatCalories } from '../../utils/dietUtils';

export interface DietFoodsManagerProps {
  open: boolean;
  diet: any;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export const DietFoodsManager = ({
  open,
  diet,
  onClose,
  onSave,
}: DietFoodsManagerProps) => {
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('');
  const [dietFoods, setDietFoods] = useState<DietFood[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodDescription, setNewFoodDescription] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState('');
  const [showNewFoodForm, setShowNewFoodForm] = useState(false);

  useEffect(() => {
    if (open && diet) {
      loadFoods();
      loadDietFoods();
    }
  }, [open, diet]);

  const loadFoods = async () => {
    const foods = await foodService.getFoods();
    setAvailableFoods(foods);
  };

  const loadDietFoods = async () => {
    const foods = await dietFoodService.getDietFoods(diet.id);
    setDietFoods(foods);
  };

  const handleAddFood = async () => {
    if (!selectedFood || !quantity) return;
    try {
      await dietFoodService.addFoodToDiet(diet.id, selectedFood.id, Number(quantity));
      setSelectedFood(null);
      setQuantity('');
      // Recargar los datos para mostrar el alimento recién agregado
      loadDietFoods();
    } catch (error) {
      console.error('Error adding food to diet:', error);
    }
  };

  const handleCreateNewFood = async () => {
    if (!newFoodName || !newFoodCalories) return;
    
    try {
      const newFood = await foodService.createFood({
        name: newFoodName,
        description: newFoodDescription,
        calories: Number(newFoodCalories)
      });
      
      // Actualizar la lista de alimentos disponibles
      setAvailableFoods(prev => [...prev, newFood]);
      
      // Seleccionar el nuevo alimento
      setSelectedFood(newFood);
      
      // Limpiar el formulario
      setNewFoodName('');
      setNewFoodDescription('');
      setNewFoodCalories('');
      setShowNewFoodForm(false);
      
      console.log('Nuevo alimento creado:', newFood);
    } catch (error) {
      console.error('Error creating new food:', error);
      alert('Error al crear el nuevo alimento. Por favor, intenta de nuevo.');
    }
  };

  const handleRemoveFood = async (dietFoodId: number) => {
    await dietFoodService.removeFoodFromDiet(dietFoodId);
    loadDietFoods();
  };

  const calculateTotalCalories = (food: Food, quantity: number) => {
    return calculateFoodCalories(food.calories, quantity);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="mdi:food-apple" />
          <Typography variant="h6">
            Gestionar alimentos de la dieta: {diet.name}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Formulario para agregar alimentos existentes */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Agregar alimento existente
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Autocomplete
                options={availableFoods}
                getOptionLabel={(option) => option.name}
                value={selectedFood}
                onChange={(_, value) => {
                  if (typeof value === 'object' && value !== null) {
                    setSelectedFood(value);
                  }
                }}
                renderInput={(params) => <TextField {...params} label="Alimento" />}
                sx={{ minWidth: 250 }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.calories} cal/100g
                      </Typography>
                    </Stack>
                  </Box>
                )}
              />
              <TextField
                label="Cantidad (g)"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                sx={{ width: 120 }}
              />
              <Button
                variant="contained"
                onClick={handleAddFood}
                disabled={!selectedFood || !quantity}
                startIcon={<Iconify icon="eva:plus-outline" />}
              >
                Agregar
              </Button>
            </Stack>
          </Box>

          {/* Botón para mostrar formulario de nuevo alimento */}
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setShowNewFoodForm(!showNewFoodForm)}
              startIcon={<Iconify icon={showNewFoodForm ? "eva:minus-outline" : "eva:plus-outline"} />}
            >
              {showNewFoodForm ? "Cancelar nuevo alimento" : "Crear nuevo alimento"}
            </Button>
          </Box>

          {/* Formulario para crear nuevo alimento */}
          {showNewFoodForm && (
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Crear nuevo alimento
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Nombre del alimento"
                  value={newFoodName}
                  onChange={e => setNewFoodName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Descripción (opcional)"
                  value={newFoodDescription}
                  onChange={e => setNewFoodDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Calorías por 100g"
                  type="number"
                  value={newFoodCalories}
                  onChange={e => setNewFoodCalories(e.target.value)}
                  required
                  sx={{ width: 200 }}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleCreateNewFood}
                    disabled={!newFoodName || !newFoodCalories}
                  >
                    Crear alimento
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowNewFoodForm(false);
                      setNewFoodName('');
                      setNewFoodDescription('');
                      setNewFoodCalories('');
                    }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Tabla de alimentos en la dieta */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Alimentos de la dieta ({dietFoods.length})
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alimento</TableCell>
                  <TableCell>Cantidad (g)</TableCell>
                  <TableCell>Calorías totales</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dietFoods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay alimentos asignados a esta dieta
                    </TableCell>
                  </TableRow>
                ) : (
                  dietFoods.map(df => (
                    <TableRow key={df.id}>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">
                            {df.foods?.name || `Alimento ID: ${df.food_id}`}
                          </Typography>
                          {df.foods?.description && (
                            <Typography variant="caption" color="text.secondary">
                              {df.foods.description}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{df.quantity}g</TableCell>
                      <TableCell>
                        {df.foods ? formatCalories(calculateTotalCalories(df.foods, df.quantity)) : formatCalories(0)}
                        {df.foods && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            ({df.foods.calories} cal/100g)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleRemoveFood(df.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Resumen de calorías totales */}
            {dietFoods.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  Total de calorías: {formatCalories(dietFoods.reduce((total, df) => 
                    total + (df.foods ? calculateTotalCalories(df.foods, df.quantity) : 0), 0
                  ))}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button onClick={() => onSave()} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};