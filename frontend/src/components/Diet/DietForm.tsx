import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Diet } from '../../types/Diet';
import { User } from '../../types/User';

interface DietFormProps {
  open: boolean;
  dietToEdit?: Diet | null;
  users: User[];
  onClose: () => void;
  onSubmit: (diet: Partial<Diet>) => void;
}

export const DietForm = ({ open, dietToEdit, onClose, onSubmit }: DietFormProps) => {
  const [formData, setFormData] = useState<Partial<Diet>>({
    user_id: undefined,
    name: '',
    description: '',
  });

  useEffect(() => {
    if (dietToEdit) setFormData({ name: dietToEdit.name, description: dietToEdit.description, user_id: dietToEdit.user_id });
    else setFormData({ user_id: undefined, name: '', description: '' });
  }, [dietToEdit, open]);

  const handleChange = (field: keyof Diet) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    const { user_id, ...dietData } = formData; // Elimina user_id si existe
    // Las calorías se calcularán dinámicamente, pero enviamos 0 por defecto para la base de datos
    onSubmit({ ...dietData, calories: 0 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dietToEdit ? 'Editar Dieta' : 'Nueva Dieta'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          value={formData.name}
          onChange={handleChange('name')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          value={formData.description}
          onChange={handleChange('description')}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};