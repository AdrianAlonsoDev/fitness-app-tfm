import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Stack,
  Autocomplete,
  Paper,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { Exercise } from '../../types/Exercise';
import { WorkoutExerciseDetail } from '../../types/WorkoutExercise';
import * as exerciseService from '../../services/exerciseService';

interface WorkoutExercisesManagerProps {
  workoutName: string;
  exercises: WorkoutExerciseDetail[];
  open: boolean;
  onClose: () => void;
  onSave: (exercises: WorkoutExerciseDetail[]) => void;
}

interface SelectedExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest_time?: number;
  notes?: string;
}

export const WorkoutExercisesManager = ({
  workoutName,
  exercises,
  open,
  onClose,
  onSave,
}: WorkoutExercisesManagerProps) => {
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 0,
    rest_time: 60,
    notes: '',
  });

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    if (open) {
      // Convertir exercises existentes a SelectedExercise format
      const convertedExercises: SelectedExercise[] = exercises.map(ex => ({
        exercise: {
          id: ex.exercise_id,
          name: ex.name,
          description: ex.description,
          executionTime: ex.execution_time,
        },
        sets: ex.sets,
        reps: ex.reps,
        notes: '',
      }));
      setSelectedExercises(convertedExercises);
    }
  }, [open, exercises]);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getExercises();
      setAvailableExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const handleAddExercise = () => {
    if (!selectedExercise) return;

    const newExercise: SelectedExercise = {
      exercise: selectedExercise,
      sets: exerciseForm.sets,
      reps: exerciseForm.reps,
      weight: exerciseForm.weight || undefined,
      duration: exerciseForm.duration || undefined,
      rest_time: exerciseForm.rest_time || undefined,
      notes: exerciseForm.notes || undefined,
    };

    setSelectedExercises([...selectedExercises, newExercise]);
    setSelectedExercise(null);
    setExerciseForm({
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 0,
      rest_time: 60,
      notes: '',
    });
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSave = () => {
    // Convertir SelectedExercise[] a WorkoutExerciseDetail[]
    const convertedExercises: WorkoutExerciseDetail[] = selectedExercises.map(ex => ({
      link_id: 0, // Will be set by backend
      exercise_id: ex.exercise.id,
      sets: ex.sets,
      reps: ex.reps,
      name: ex.exercise.name,
      description: ex.exercise.description,
      execution_time: ex.exercise.executionTime || 0,
    }));

    onSave(convertedExercises);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="solar:dumbbell-large-bold-duotone" />
          <Typography variant="h6">
            Gestionar Ejercicios - {workoutName}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Agregar Ejercicio
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Autocomplete
              options={availableExercises}
              getOptionLabel={(option) => option.name}
              value={selectedExercise}
              onChange={(_, value) => setSelectedExercise(value)}
              renderInput={(params) => (
                <TextField {...params} label="Ejercicio" />
              )}
              sx={{ minWidth: 200 }}
            />
            
            <TextField
              label="Sets"
              type="number"
              value={exerciseForm.sets}
              onChange={(e) => setExerciseForm({
                ...exerciseForm,
                sets: parseInt(e.target.value) || 0
              })}
              inputProps={{ min: 1, max: 50 }}
              sx={{ width: 80 }}
            />
            
            <TextField
              label="Reps"
              type="number"
              value={exerciseForm.reps}
              onChange={(e) => setExerciseForm({
                ...exerciseForm,
                reps: parseInt(e.target.value) || 0
              })}
              inputProps={{ min: 1, max: 100 }}
              sx={{ width: 80 }}
            />
            
            <TextField
              label="Peso (kg)"
              type="number"
              value={exerciseForm.weight}
              onChange={(e) => setExerciseForm({
                ...exerciseForm,
                weight: parseFloat(e.target.value) || 0
              })}
              inputProps={{ min: 0, step: 0.5 }}
              sx={{ width: 100 }}
            />
            
            <Button
              variant="contained"
              onClick={handleAddExercise}
              disabled={!selectedExercise}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Agregar
            </Button>
          </Stack>
        </Box>

        <Typography variant="h6" gutterBottom>
          Ejercicios del Entrenamiento ({selectedExercises.length})
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ejercicio</TableCell>
                <TableCell>Sets</TableCell>
                <TableCell>Reps</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell>Descanso</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedExercises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      No hay ejercicios agregados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                selectedExercises.map((exercise, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {exercise.exercise.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exercise.exercise.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleUpdateExercise(
                          index, 
                          'sets', 
                          parseInt(e.target.value) || 0
                        )}
                        inputProps={{ min: 1, max: 50 }}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleUpdateExercise(
                          index,
                          'reps',
                          parseInt(e.target.value) || 0
                        )}
                        inputProps={{ min: 1, max: 100 }}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => handleUpdateExercise(
                          index,
                          'weight',
                          parseFloat(e.target.value) || undefined
                        )}
                        inputProps={{ min: 0, step: 0.5 }}
                        sx={{ width: 80 }}
                        placeholder="kg"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={exercise.duration || ''}
                        onChange={(e) => handleUpdateExercise(
                          index,
                          'duration',
                          parseInt(e.target.value) || undefined
                        )}
                        inputProps={{ min: 0 }}
                        sx={{ width: 80 }}
                        placeholder="min"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={exercise.rest_time || ''}
                        onChange={(e) => handleUpdateExercise(
                          index,
                          'rest_time',
                          parseInt(e.target.value) || undefined
                        )}
                        inputProps={{ min: 0 }}
                        sx={{ width: 80 }}
                        placeholder="seg"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained">
          Guardar Ejercicios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
