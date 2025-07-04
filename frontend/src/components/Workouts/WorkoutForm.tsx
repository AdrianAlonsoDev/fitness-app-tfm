import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  MenuItem,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { Workout } from '../../types/Workout';
import { Exercise } from '../../types/Exercise';
import { User } from '../../types/User';
import { getExercises, createExercise } from '../../services/exerciseService';
import { SelectedExercise } from '../../types/WorkoutExercise'; 
import { WorkoutWithExercises } from '../../types/WorkoutWithExercises';

interface WorkoutFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    workout: Omit<Workout, 'id'>,
    exercises?: SelectedExercise[]
  ) => void;
  workoutToEdit?: WorkoutWithExercises | null;
  users: User[];
}

export const WorkoutForm = ({
  open,
  onClose,
  onSubmit,
  workoutToEdit,
  users
}: WorkoutFormProps) => {
  const [formData, setFormData] = useState({
    user_id: '' as number | '',
    name: '',
    category: '',
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentSets, setCurrentSets] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    execution_time: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    if (workoutToEdit) {
      setFormData({
        user_id: workoutToEdit.user_id,
        name: workoutToEdit.name,
        category: workoutToEdit.category,
        notes: workoutToEdit.notes,
      });

      if (workoutToEdit.exercises && Array.isArray(workoutToEdit.exercises)) {
        const initialExercises = workoutToEdit.exercises.map((ex) => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps
        }));
        setSelectedExercises(initialExercises);
      }
    } else {
      setFormData({
        user_id: '',
        name: '',
        category: '',
        notes: '',
      });
      setSelectedExercises([]);
    }
    setErrors([]);
    setCurrentExercise('');
    setCurrentSets('');
    setCurrentReps('');
    setShowNewExerciseForm(false);
    setNewExercise({ name: '', description: '', execution_time: '' });
  }, [workoutToEdit, open]);

  const loadExercises = async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.user_id) newErrors.push('Debe seleccionar un usuario');
    if (!formData.name.trim()) newErrors.push('El nombre es obligatorio');
    if (!formData.category.trim()) newErrors.push('La categoría es obligatoria');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'user_id' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddExercise = () => {
    if (!currentExercise || !currentSets || !currentReps) {
      setErrors(['Por favor completa todos los campos del ejercicio']);
      return;
    }

    const exerciseId = parseInt(currentExercise);
    if (selectedExercises.some((e) => e.exercise_id === exerciseId)) {
      setErrors(['Este ejercicio ya fue agregado']);
      return;
    }

    const newExercise = {
      exercise_id: exerciseId,
      sets: parseInt(currentSets),
      reps: parseInt(currentReps)
    };

    setSelectedExercises([...selectedExercises, newExercise]);
    setCurrentExercise('');
    setCurrentSets('');
    setCurrentReps('');
    setErrors([]);
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter((e) => e.exercise_id !== exerciseId));
  };

  const handleCreateExercise = async () => {
    const parsedTime = parseInt(newExercise.execution_time);
    
    if (!newExercise.name.trim() || isNaN(parsedTime)) {
      setErrors(['El nombre y un tiempo de ejecución válido son obligatorios']);
      return;
    }

    const exerciseData = {
      name: newExercise.name.trim(),
      description: newExercise.description.trim(),
      execution_time: parsedTime
    };

    try {
      const created = await createExercise(exerciseData);
      setExercises((prev) => [...prev, created]);
      setNewExercise({ name: '', description: '', execution_time: '' });
      setShowNewExerciseForm(false);
      setErrors([]);
    } catch (error) {
      console.error('Error al crear ejercicio:', error);
      setErrors(['Ocurrió un error al guardar el ejercicio']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(
      { 
        user_id: formData.user_id as number, 
        name: formData.name.trim(), 
        category: formData.category.trim(), 
        notes: formData.notes.trim() 
      },
      selectedExercises
    );

    onClose();
  };

  const getExerciseName = (exerciseId: number) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : '';
  };

  const categories = [
    'Fuerza',
    'Cardio',
    'Flexibilidad',
    'Resistencia',
    'Funcional',
    'HIIT',
    'Yoga',
    'Pilates',
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="h2">
            {workoutToEdit ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
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

            {/* Información básica */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Usuario Asignado"
                  value={formData.user_id}
                  onChange={handleFormChange('user_id')}
                  error={errors.some(e => e.includes('usuario'))}
                  required
                >
                  <MenuItem value="">Seleccionar usuario</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} {user.surname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  value={formData.category}
                  onChange={handleFormChange('category')}
                  error={errors.some(e => e.includes('categoría'))}
                  required
                >
                  <MenuItem value="">Seleccionar categoría</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Nombre del Entrenamiento"
              value={formData.name}
              onChange={handleFormChange('name')}
              error={errors.some(e => e.includes('nombre'))}
              required
            />

            <TextField
              fullWidth
              label="Notas (opcional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleFormChange('notes')}
            />

            <Divider />

            {/* Sección de ejercicios */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {workoutToEdit ? 'Ejercicios asignados' : 'Agregar ejercicios al entrenamiento'}
              </Typography>

              {/* Ejercicios seleccionados */}
              {selectedExercises.length > 0 ? (
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {selectedExercises.map((exercise) => (
                    <Card key={exercise.exercise_id} variant="outlined">
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              {getExerciseName(exercise.exercise_id)}
                            </Typography>
                            <Chip 
                              label={`${exercise.sets} series × ${exercise.reps} reps`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveExercise(exercise.exercise_id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="eva:trash-2-outline" sx={{ width: 16, height: 16 }} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                  No hay ejercicios asignados
                </Typography>
              )}

              {/* Selector de ejercicios */}
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Agregar ejercicio
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Ejercicio"
                      value={currentExercise}
                      onChange={(e) => setCurrentExercise(e.target.value)}
                    >
                      <MenuItem value="">Seleccionar ejercicio</MenuItem>
                      {exercises.map((ex) => (
                        <MenuItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Series"
                      value={currentSets}
                      onChange={(e) => setCurrentSets(e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Repeticiones"
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleAddExercise}
                      startIcon={<Iconify icon="eva:plus-outline" />}
                    >
                      Agregar
                    </Button>
                  </Grid>
                </Grid>
              </Card>

              {/* Nuevo ejercicio */}
              {!showNewExerciseForm ? (
                <Button
                  variant="text"
                  startIcon={<Iconify icon="eva:plus-outline" />}
                  onClick={() => setShowNewExerciseForm(true)}
                  sx={{ mb: 2 }}
                >
                  Crear nuevo ejercicio
                </Button>
              ) : (
                <Collapse in={showNewExerciseForm}>
                  <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Crear nuevo ejercicio
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Nombre del ejercicio"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <TextField
                        fullWidth
                        label="Descripción"
                        multiline
                        rows={2}
                        value={newExercise.description}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Tiempo de ejecución (segundos)"
                        value={newExercise.execution_time}
                        onChange={(e) => setNewExercise(prev => ({ ...prev, execution_time: e.target.value }))}
                        inputProps={{ min: 1 }}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          onClick={handleCreateExercise}
                          size="small"
                        >
                          Guardar ejercicio
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setShowNewExerciseForm(false)}
                          size="small"
                        >
                          Cancelar
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                </Collapse>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            {workoutToEdit ? 'Actualizar' : 'Crear'} Entrenamiento
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};