import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { DietWithFoods } from '../../types/DietWithFoods';
import { calculateDietCalories, formatCalories, calculateFoodCalories } from '../../utils/dietUtils';

interface DietDetailProps {
  open: boolean;
  diet: DietWithFoods;
  onClose: () => void;
}

export const DietDetail = ({ open, diet, onClose }: DietDetailProps) => {
  const totalCalories = calculateDietCalories(diet);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle de Dieta</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{diet.name}</Typography>
        <Typography variant="subtitle2">Descripción: {diet.description}</Typography>
        <Typography variant="subtitle2">
          Calorías totales: {formatCalories(totalCalories)}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Alimentos:</Typography>
        <List>
          {diet.diet_foods && diet.diet_foods.length > 0 ? (
            diet.diet_foods.map(dietFood => (
              <ListItem key={dietFood.id}>
                <ListItemText 
                  primary={dietFood.foods?.name || 'Alimento desconocido'}
                  secondary={`${dietFood.quantity}g - ${formatCalories(
                    dietFood.foods 
                      ? calculateFoodCalories(dietFood.foods.calories, dietFood.quantity)
                      : 0
                  )}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay alimentos en esta dieta" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};