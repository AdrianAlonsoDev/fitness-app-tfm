import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { Diet } from '../../types/Diet';
import * as dietService from '../../services/dietService';
import * as userService from '../../services/userService';

interface DietUsersDialogProps {
  open: boolean;
  diet: Diet | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const DietUsersDialog = ({ open, diet, onClose, onUpdate }: DietUsersDialogProps) => {
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && diet) {
      loadData();
    }
  }, [open, diet]);

  const loadData = async () => {
    if (!diet) return;
    setLoading(true);
    
    console.log('📊 Cargando datos para dieta:', diet.id);
    
    try {
      const [assigned, all] = await Promise.all([
        dietService.getDietUsers(diet.id),
        userService.getUsers(),
      ]);
      
      console.log('📋 Usuarios asignados:', assigned);
      console.log('👥 Todos los usuarios:', all.length);
      
      setAssignedUsers(assigned);
      setAllUsers(all);
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      alert(`Error al cargar datos: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async () => {
    if (!diet || !selectedUser) return;
    
    console.log('🔄 Asignando usuario:', { 
      dietId: diet.id, 
      userId: selectedUser.id, 
      userName: selectedUser.name 
    });
    
    try {
      await dietService.assignUserToDiet(diet.id, selectedUser.id);
      console.log('✅ Usuario asignado exitosamente');
      setSelectedUser(null);
      await loadData();
      onUpdate();
    } catch (error: any) {
      console.error('❌ Error asignando usuario:', error);
      alert(`Error al asignar usuario: ${error.message || error}`);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!diet) return;
    try {
      await dietService.removeUserFromDiet(diet.id, userId);
      await loadData();
      onUpdate();
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const availableUsers = allUsers.filter(
    user => !assignedUsers.some(assigned => assigned.id === user.id)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Usuarios asignados a: {diet?.name}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                options={availableUsers}
                getOptionLabel={(option) => `${option.name} ${option.surname || ''} (${option.email})`}
                renderInput={(params) => (
                  <TextField {...params} label="Seleccionar usuario" variant="outlined" />
                )}
                noOptionsText="No hay usuarios disponibles"
              />
              <Button
                variant="contained"
                onClick={handleAssignUser}
                disabled={!selectedUser}
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{ mt: 2 }}
                fullWidth
              >
                Asignar Usuario
              </Button>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Usuarios asignados ({assignedUsers.length})
            </Typography>
            
            {assignedUsers.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No hay usuarios asignados a esta dieta
              </Typography>
            ) : (
              <List>
                {assignedUsers.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemText
                      primary={`${user.name} ${user.surname || ''}`}
                      secondary={user.email}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};