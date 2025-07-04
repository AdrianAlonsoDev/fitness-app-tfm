import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Alert,
} from '@mui/material';
import { User } from '../../types/User';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id' | 'created_at'>) => void;
  userToEdit?: User | null;
}

export const UserForm = ({ open, onClose, onSubmit, userToEdit }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birth_date: '',
    role: 'client',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (userToEdit) {
      let formattedDate = '';
      if (userToEdit.birth_date) {
        formattedDate = userToEdit.birth_date;
      }

      setFormData({
        name: userToEdit.name || '',
        surname: userToEdit.surname || '',
        email: userToEdit.email || '',
        password: '',
        birth_date: formattedDate,
        role: userToEdit.role || 'client',
      });
    } else {
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        birth_date: '',
        role: 'client',
      });
    }
    setErrors([]);
  }, [userToEdit, open]);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('El nombre es obligatorio');
    if (!formData.surname.trim()) newErrors.push('El apellido es obligatorio');
    if (!formData.email.trim()) newErrors.push('El email es obligatorio');
    if (!formData.email.includes('@')) newErrors.push('El email debe ser válido');
    if (!userToEdit && !formData.password) newErrors.push('La contraseña es obligatoria');
    if (!formData.birth_date) newErrors.push('La fecha de nacimiento es obligatoria');
    if (!formData.role) newErrors.push('El rol es obligatorio');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;


    const submitData = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email.trim(),
      password: formData.password,
      birth_date: formData.birth_date, 
      role: formData.role,
    };

    console.log('Frontend: Enviando datos de usuario:', submitData);
    onSubmit(submitData);
    onClose();
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="h2">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {errors.length > 0 && (
              <Alert severity="error">
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={handleChange('name')}
                error={errors.some(e => e.includes('nombre'))}
                required
              />
              <TextField
                fullWidth
                label="Apellido"
                value={formData.surname}
                onChange={handleChange('surname')}
                error={errors.some(e => e.includes('apellido'))}
                required
              />
            </Stack>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.some(e => e.includes('email'))}
              required
            />

            {!userToEdit && (
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.some(e => e.includes('contraseña'))}
                required
              />
            )}

            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birth_date}
              onChange={handleChange('birth_date')}
              InputLabelProps={{ shrink: true }}
              error={errors.some(e => e.includes('fecha de nacimiento'))}
              required
            />

            <TextField
              select
              fullWidth
              label="Rol"
              value={formData.role}
              onChange={handleChange('role')}
              error={errors.some(e => e.includes('rol'))}
              required
            >
              <MenuItem value="client">Cliente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            {userToEdit ? 'Actualizar' : 'Crear'} Usuario
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};