import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { getWorkoutWithExercises } from '../../services/workoutService';
import { WorkoutWithExercises } from '../../types/WorkoutWithExercises';

interface Props {
  workoutId: number;
  open: boolean;
  onClose: () => void;
}

export const WorkoutDetail: React.FC<Props> = ({ workoutId, open, onClose }) => {
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkoutWithExercises(workoutId);
        setWorkout(data);
      } catch (err) {
        setError('No se pudo cargar el entrenamiento');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, open]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'strength':
      case 'fuerza':
        return 'error';
      case 'cardio':
        return 'info';
      case 'flexibility':
      case 'flexibilidad':
        return 'success';
      case 'endurance':
      case 'resistencia':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {loading ? (
            <Typography variant="h6">Cargando...</Typography>
          ) : workout ? (
            <Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                {workout.name}
              </Typography>
              <Chip
                label={workout.category}
                color={getCategoryColor(workout.category)}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          ) : (
            <Typography variant="h6">Entrenamiento</Typography>
          )}
          
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {workout && (
          <Stack spacing={3}>
            {workout.notes && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Notas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {workout.notes}
                </Typography>
              </Box>
            )}

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Ejercicios ({workout.exercises?.length || 0})
              </Typography>
              
              {!workout.exercises || workout.exercises.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <Iconify icon="eva:info-outline" sx={{ width: 48, height: 48, mb: 2 }} />
                  <Typography variant="body2">
                    No hay ejercicios asignados a este entrenamiento
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {workout.exercises.map((ex, index) => (
                    <Card key={ex.link_id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              minWidth: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Box>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {ex.name}
                            </Typography>
                            
                            {ex.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {ex.description}
                              </Typography>
                            )}
                            
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                icon={<Iconify icon="eva:repeat-outline" sx={{ width: 16, height: 16 }} />}
                                label={`${ex.sets} series`}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Chip
                                icon={<Iconify icon="eva:checkmark-circle-2-outline" sx={{ width: 16, height: 16 }} />}
                                label={`${ex.reps} reps`}
                                size="small"
                                variant="outlined"
                                color="success"
                              />
                              <Chip
                                icon={<Iconify icon="eva:clock-outline" sx={{ width: 16, height: 16 }} />}
                                label={`${ex.execution_time}s`}
                                size="small"
                                variant="outlined"
                                color="warning"
                              />
                            </Stack>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
