import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { Workout } from '../../types/Workout';
import * as workoutService from '../../services/workoutService';
import * as userService from '../../services/userService';

interface WorkoutUserDialogProps {
  open: boolean;
  workout: Workout | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const WorkoutUserDialog = ({ open, workout, onClose, onUpdate }: WorkoutUserDialogProps) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && workout) {
      loadData();
    }
  }, [open, workout]);

  const loadData = async () => {
    if (!workout) return;
    setLoading(true);
    
    console.log('📊 Cargando datos para workout:', workout.id);
    
    try {
      const [current, all] = await Promise.all([
        workoutService.getWorkoutUser(workout.id),
        userService.getUsers(),
      ]);
      
      console.log('👤 Usuario actual:', current);
      console.log('👥 Todos los usuarios:', all.length);
      
      setCurrentUser(current);
      setAllUsers(all);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      alert(`Error al cargar datos: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOwner = async () => {
    if (!workout || !selectedUser) return;
    
    console.log('🔄 Cambiando propietario:', { 
      workoutId: workout.id, 
      newUserId: selectedUser.id, 
      newUserName: selectedUser.name 
    });
    
    try {
      await workoutService.changeWorkoutOwner(workout.id, selectedUser.id);
      console.log('✅ Propietario cambiado exitosamente');
      await loadData();
      onUpdate();
    } catch (error: any) {
      console.error('❌ Error cambiando propietario:', error);
      alert(`Error al cambiar propietario: ${error.message || error}`);
    }
  };

  const handleRemoveOwner = async () => {
    if (!workout) return;
    
    const confirm = window.confirm('¿Estás seguro de que quieres quitar el usuario? El entrenamiento quedará sin asignar.');
    if (!confirm) return;
    
    try {
      await workoutService.removeWorkoutOwner(workout.id);
      console.log('✅ Propietario quitado exitosamente');
      await loadData();
      onUpdate();
    } catch (error: any) {
      console.error('❌ Error quitando propietario:', error);
      alert(`Error al quitar propietario: ${error.message || error}`);
    }
  };

  const availableUsers = allUsers.filter(user => user.id !== currentUser?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:user-bold-duotone" width={24} />
          <Typography variant="h6">
            Usuario: {workout?.name}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Cambiar el usuario transferirá el entrenamiento completo, 
                incluyendo todos los ejercicios configurados (sets, reps, etc.).
              </Typography>
            </Alert>

            
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Usuario actual:
              </Typography>
              {currentUser ? (
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {currentUser.name} {currentUser.surname || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Chip 
                    label="Usuario" 
                    color="primary" 
                    size="small"
                    icon={<Iconify icon="solar:user-bold" width={16} />}
                  />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin usuario asignado
                </Typography>
              )}
            </Box>

            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Cambiar usuario:
              </Typography>
              <Autocomplete
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                options={availableUsers}
                getOptionLabel={(option) => `${option.name} ${option.surname || ''} (${option.email})`}
                renderInput={(params) => (
                  <TextField {...params} label="Seleccionar nuevo usuario" variant="outlined" />
                )}
                noOptionsText="No hay otros usuarios disponibles"
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleChangeOwner}
                  disabled={!selectedUser}
                  startIcon={<Iconify icon="solar:transfer-horizontal-bold" />}
                  fullWidth
                >
                  Cambiar Usuario
                </Button>
                {currentUser && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveOwner}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  >
                    Quitar
                  </Button>
                )}
              </Stack>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
