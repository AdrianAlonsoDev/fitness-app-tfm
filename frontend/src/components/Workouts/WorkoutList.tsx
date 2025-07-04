import { useState } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Box,
  Chip,
  IconButton,
  TablePagination,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { WorkoutWithExercises } from '../../types/WorkoutWithExercises';
import { User } from '../../types/User';
import { WorkoutCard } from './WorkoutCard';

interface WorkoutListProps {
  workouts: WorkoutWithExercises[];
  users: User[];
  onEdit: (workout: WorkoutWithExercises) => void;
  onDelete: (id: number) => void;
  onViewDetails: (workout: WorkoutWithExercises) => void;
  onManageExercises: (workout: WorkoutWithExercises) => void;
  onManageUser: (workout: WorkoutWithExercises) => void;
  loading?: boolean;
}

export const WorkoutList = ({ 
  workouts, 
  users,
  onEdit, 
  onDelete, 
  onViewDetails, 
  onManageExercises, 
  onManageUser,
  loading 
}: WorkoutListProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Function to get user name by ID
  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} ${user.surname}` : `Usuario #${userId}`;
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Cargando entrenamientos...</Typography>
      </Box>
    );
  }

  if (workouts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No hay entrenamientos registrados
        </Typography>
      </Box>
    );
  }

  const paginatedWorkouts = workouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Mobile view - Card Grid
  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={3}>
          {paginatedWorkouts.map((workout) => (
            <Grid key={workout.id} size={{ xs: 12, sm: 6 }}>
              <WorkoutCard
                workout={workout}
                userName={getUserName(workout.user_id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onManageExercises={onManageExercises}
                onManageUser={onManageUser}
              />
            </Grid>
          ))}
        </Grid>
        <TablePagination
          component="div"
          count={workouts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  // Desktop view - Table
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="center">Ejercicios</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedWorkouts.map((workout) => (
              <TableRow key={workout.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {workout.name}
                  </Typography>
                  {workout.notes && (
                    <Typography variant="body2" color="text.secondary">
                      {workout.notes}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getUserName(workout.user_id)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={workout.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<Iconify icon="solar:dumbbell-bold" width={16} />}
                    label={workout.workout_exercises?.length || workout.exercises?.length || 0}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => onViewDetails(workout)}
                  >
                    <Iconify icon="solar:eye-bold" width={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => onManageExercises(workout)}
                  >
                    <Iconify icon="solar:dumbbell-bold" width={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => onManageUser(workout)}
                    title="Gestionar usuario"
                  >
                    <Iconify icon="solar:user-bold" width={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(workout)}
                  >
                    <Iconify icon="solar:pen-bold" width={16} />
                  </IconButton>
                  <IconButton
                    size="small" 
                    color="error"
                    onClick={() => onDelete(workout.id)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={workouts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};
