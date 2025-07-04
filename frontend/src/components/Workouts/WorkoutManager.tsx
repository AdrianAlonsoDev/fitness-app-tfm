import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { WorkoutWithExercises } from '../../types/WorkoutWithExercises';
import { WorkoutExerciseDetail } from '../../types/WorkoutExercise';
import { User } from '../../types/User';
import * as workoutService from '../../services/workoutService';
import * as userService from '../../services/userService';
import { useToast } from '../../utils/notifications';
import { useExport } from '../../utils/hooks/useExport';
import { WorkoutList } from './WorkoutList';
import { WorkoutForm } from './WorkoutForm';
import { WorkoutDetail } from './WorkoutDetail';
import { WorkoutExercisesManager } from './workout-exercises-manager';
import { WorkoutUserDialog } from './WorkoutUserDialog';

export const WorkoutManager = () => {
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutWithExercises | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<WorkoutWithExercises | null>(null);
  const [exerciseManagerWorkout, setExerciseManagerWorkout] = useState<WorkoutWithExercises | null>(null);
  const [userManagerWorkout, setUserManagerWorkout] = useState<WorkoutWithExercises | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [exerciseManagerOpen, setExerciseManagerOpen] = useState(false);
  const [userManagerOpen, setUserManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { showToast, ToastContainer } = useToast();
  const { exportToCSV, exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    loadWorkouts();
    loadUsers();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, searchQuery]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkoutsWithExercises();
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
      showToast('Error al cargar entrenamientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filterWorkouts = () => {
    if (!searchQuery.trim()) {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    }
  };

  const handleAdd = () => {
    setEditingWorkout(null);
    setError(null);
    setFormOpen(true);
  };

  const handleEdit = (workout: WorkoutWithExercises) => {
    setEditingWorkout(workout);
    setError(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      try {
        await workoutService.deleteWorkout(id);
        showToast('Entrenamiento eliminado exitosamente', 'success');
        loadWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
        showToast('Error al eliminar entrenamiento', 'error');
      }
    }
  };

  const handleViewDetails = (workout: WorkoutWithExercises) => {
    setViewingWorkout(workout);
    setDetailOpen(true);
  };

  const handleManageExercises = (workout: WorkoutWithExercises) => {
    setExerciseManagerWorkout(workout);
    setExerciseManagerOpen(true);
  };

  const handleManageUser = (workout: WorkoutWithExercises) => {
    setUserManagerWorkout(workout);
    setUserManagerOpen(true);
  };

  const handleSubmit = async (workoutData: any) => {
    try {
      setError(null);
      if (editingWorkout) {
        await workoutService.updateWorkout(editingWorkout.id, workoutData);
        showToast('Entrenamiento actualizado exitosamente', 'success');
      } else {
        await workoutService.createWorkout(workoutData);
        showToast('Entrenamiento creado exitosamente', 'success');
      }
      setFormOpen(false);
      loadWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('Error al guardar el entrenamiento. Por favor, intenta de nuevo.');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setError(null);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setViewingWorkout(null);
  };

  const handleExerciseManagerClose = () => {
    setExerciseManagerOpen(false);
    setExerciseManagerWorkout(null);
  };

  const handleUserManagerClose = () => {
    setUserManagerOpen(false);
    setUserManagerWorkout(null);
  };

  const handleSaveExercises = async (exercises: WorkoutExerciseDetail[]) => {
    if (!exerciseManagerWorkout) return;
    
    try {
      await workoutService.removeAllExercisesFromWorkout(exerciseManagerWorkout.id);
      
      if (exercises.length > 0) {
        const selectedExercises = exercises.map(ex => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps
        }));
        
        await workoutService.addExercisesToWorkout(exerciseManagerWorkout.id, selectedExercises);
      }
      
      showToast('Ejercicios actualizados exitosamente', 'success');
      setExerciseManagerOpen(false);
      loadWorkouts();
    } catch (error) {
      console.error('Error saving exercises:', error);
      showToast('Error al guardar ejercicios', 'error');
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const headers = ['ID', 'Nombre', 'Categoría', 'Usuario', 'Ejercicios'];
    const data = filteredWorkouts.map(workout => [
      workout.id.toString(),
      workout.name,
      workout.category,
      'N/A', 
      workout.exercises?.length.toString() || '0'
    ]);

    const exportData = {
      headers,
      data,
      filename: 'entrenamientos',
      title: 'Entrenamientos'
    };

    switch (format) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'pdf':
        exportToPDF(exportData);
        break;
      case 'excel':
        exportToExcel(exportData);
        break;
    }
    setExportMenuAnchor(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Gestión de Entrenamientos
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Nuevo Entrenamiento
          </Button>
        </Stack>
      </Box>

      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar entrenamientos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      
      <WorkoutList
        workouts={filteredWorkouts}
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onManageExercises={handleManageExercises}
        onManageUser={handleManageUser}
        loading={loading}
      />

      
      <WorkoutForm
        open={formOpen}
        workoutToEdit={editingWorkout}
        users={users}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
      />

      
      {viewingWorkout && (
        <WorkoutDetail
          open={detailOpen}
          workoutId={viewingWorkout.id}
          onClose={handleDetailClose}
        />
      )}

      
      {exerciseManagerWorkout && (
        <WorkoutExercisesManager
          open={exerciseManagerOpen}
          workoutName={exerciseManagerWorkout.name}
          exercises={exerciseManagerWorkout.exercises || (exerciseManagerWorkout.workout_exercises ? exerciseManagerWorkout.workout_exercises.map(we => ({
            link_id: we.id,
            exercise_id: we.exercises.id,
            sets: we.sets,
            reps: we.reps,
            name: we.exercises.name,
            description: we.exercises.description,
            execution_time: we.exercises.execution_time
          })) : [])}
          onClose={handleExerciseManagerClose}
          onSave={handleSaveExercises}
        />
      )}

      
      <WorkoutUserDialog
        open={userManagerOpen}
        workout={userManagerWorkout}
        onClose={handleUserManagerClose}
        onUpdate={loadWorkouts}
      />

      
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExport('pdf')}>
          <Iconify icon="eva:file-text-fill" sx={{ mr: 2 }} />
          Exportar a PDF
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <Iconify icon="eva:file-fill" sx={{ mr: 2 }} />
          Exportar a Excel
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <Iconify icon="eva:file-text-outline" sx={{ mr: 2 }} />
          Exportar a CSV
        </MenuItem>
      </Menu>
    </Box>
  );
};
