import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { WorkoutWithExercises } from '../../types/WorkoutWithExercises';

interface WorkoutCardProps {
  workout: WorkoutWithExercises;
  userName?: string;
  onEdit: (workout: WorkoutWithExercises) => void;
  onDelete: (id: number) => void;
  onViewDetails: (workout: WorkoutWithExercises) => void;
  onManageExercises?: (workout: WorkoutWithExercises) => void;
  onManageUser?: (workout: WorkoutWithExercises) => void;
}

export const WorkoutCard = ({
  workout,
  userName,
  onEdit,
  onDelete,
  onViewDetails,
  onManageExercises,
  onManageUser
}: WorkoutCardProps) => {
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
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
            {workout.name}
          </Typography>
          {userName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Asignado a: {userName}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={workout.category}
              color={getCategoryColor(workout.category)}
              size="small"
            />
            {((workout.workout_exercises && workout.workout_exercises.length > 0) || (workout.exercises && workout.exercises.length > 0)) && (
              <Chip
                icon={<Iconify icon="solar:dumbbell-bold" sx={{ width: 14, height: 14 }} />}
                label={`${workout.workout_exercises?.length || workout.exercises?.length || 0} ejercicios`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {workout.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {workout.notes}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <IconButton
          size="small"
          onClick={() => onViewDetails(workout)}
          sx={{
            color: 'info.main',
            '&:hover': { bgcolor: 'info.lighter' },
          }}
        >
          <Iconify icon="eva:eye-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>
        
        <Box>
          {onManageExercises && (
            <IconButton
              size="small"
              onClick={() => onManageExercises(workout)}
              sx={{
                color: 'secondary.main',
                '&:hover': { bgcolor: 'secondary.lighter' },
                mr: 0.5,
              }}
            >
              <Iconify icon="solar:dumbbell-bold" sx={{ width: 18, height: 18 }} />
            </IconButton>
          )}
          
          {onManageUser && (
            <IconButton
              size="small"
              onClick={() => onManageUser(workout)}
              sx={{
                color: 'info.main',
                '&:hover': { bgcolor: 'info.lighter' },
                mr: 0.5,
              }}
              title="Gestionar usuario"
            >
              <Iconify icon="solar:user-bold" sx={{ width: 18, height: 18 }} />
            </IconButton>
          )}
          
          <IconButton
            size="small"
            onClick={() => onEdit(workout)}
            sx={{
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.lighter' },
              mr: 0.5,
            }}
          >
            <Iconify icon="eva:edit-2-outline" sx={{ width: 18, height: 18 }} />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => onDelete(workout.id)}
            sx={{
              color: 'error.main',
              '&:hover': { bgcolor: 'error.lighter' },
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
