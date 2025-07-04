import { Workout } from '../types/Workout';
import { SelectedExercise } from '../types/WorkoutExercise';
import { WorkoutWithExercises } from '../types/WorkoutWithExercises';
import axiosInstance from '../lib/axios';

export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const response = await axiosInstance.get('/workouts');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener entrenamientos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener entrenamientos');
  }
};

export const getWorkoutsWithExercises = async (): Promise<WorkoutWithExercises[]> => {
  try {
    const response = await axiosInstance.get('/workouts/with-exercises');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener entrenamientos con ejercicios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener entrenamientos con ejercicios');
  }
};

export const createWorkout = async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
  try {
    const response = await axiosInstance.post('/workouts', workout);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear entrenamiento');
  }
};

export const updateWorkout = async (id: number, workout: Omit<Workout, 'id'>): Promise<Workout> => {
  try {
    const response = await axiosInstance.put(`/workouts/${id}`, workout);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al actualizar entrenamiento');
  }
};

export const deleteWorkout = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/workouts/${id}`);
  } catch (error: any) {
    console.error('Error al eliminar entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar entrenamiento');
  }
};

export const getWorkoutWithExercises = async (id: number): Promise<WorkoutWithExercises> => {
  try {
    const response = await axiosInstance.get(`/workouts/${id}/details`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener entrenamiento con ejercicios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener entrenamiento con ejercicios');
  }
};

export const getWorkoutDetails = async (id: number): Promise<WorkoutWithExercises> => {
  try {
    const response = await axiosInstance.get(`/workouts/${id}/details`);
    return response.data;
  } catch (error: any) {
    console.error('Error al cargar detalles del entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'No se pudieron cargar los detalles del entrenamiento');
  }
};

export const addExercisesToWorkout = async (
  workoutId: number,
  exercises: SelectedExercise[]
) => {
  try {
    const payload = exercises.map((ex) => ({
      workout_id: workoutId,
      ...ex
    }));

    const response = await axiosInstance.post('/workouts_exercises', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error al agregar ejercicios al entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al agregar ejercicios al entrenamiento');
  }
};

export const removeAllExercisesFromWorkout = async (workoutId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/workouts_exercises/workout/${workoutId}`);
  } catch (error: any) {
    console.error('Error al eliminar ejercicios del entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar ejercicios del entrenamiento');
  }
};

// Obtener el usuario propietario de un workout
export const getWorkoutUser = async (workoutId: number): Promise<any | null> => {
  try {
    console.log(` Obteniendo usuario propietario del workout ${workoutId}`);
    const response = await axiosInstance.get(`/workouts/${workoutId}/user`);
    console.log('👤 Usuario propietario obtenido:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error al obtener usuario del workout:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al obtener usuario del workout');
  }
};

// Cambiar el propietario de un workout
export const changeWorkoutOwner = async (workoutId: number, userId: number): Promise<void> => {
  try {
    console.log(`🔄 Cambiando propietario del workout ${workoutId} a usuario ${userId}`);
    const response = await axiosInstance.put(`/workouts/${workoutId}/user/${userId}`);
    console.log('✅ Respuesta del servidor:', response.data);
  } catch (error: any) {
    console.error('❌ Error al cambiar propietario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al cambiar propietario');
  }
};

// Quitar el propietario de un workout
export const removeWorkoutOwner = async (workoutId: number): Promise<void> => {
  try {
    console.log(`🗑️ Quitando propietario del workout ${workoutId}`);
    const response = await axiosInstance.delete(`/workouts/${workoutId}/user`);
    console.log('✅ Propietario quitado:', response.data);
  } catch (error: any) {
    console.error('❌ Error al quitar propietario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al quitar propietario');
  }
};
