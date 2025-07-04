import { WorkoutExercise, WorkoutExerciseDetail } from '../types/WorkoutExercise';
import axiosInstance from '../lib/axios';

export const getWorkoutExercises = async (workoutId: number): Promise<WorkoutExerciseDetail[]> => {
  try {
    const response = await axiosInstance.get(`/workout_exercises/workout/${workoutId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener ejercicios del entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener ejercicios del entrenamiento');
  }
};

export const addExerciseToWorkout = async (data: WorkoutExercise): Promise<WorkoutExercise> => {
  try {
    const response = await axiosInstance.post('/workout_exercises', data);
    return response.data;
  } catch (error: any) {
    console.error('Error al agregar ejercicio al entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al agregar ejercicio al entrenamiento');
  }
};

export const removeExerciseFromWorkout = async (linkId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/workout_exercises/${linkId}`);
  } catch (error: any) {
    console.error('Error al eliminar ejercicio del entrenamiento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar ejercicio del entrenamiento');
  }
};
