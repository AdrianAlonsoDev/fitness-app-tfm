export interface WorkoutExercise {
  id?: number;
  workout_id: number;
  exercise_id: number;
  sets?: number;
  reps?: number;
}


export interface WorkoutExerciseDetail {
  link_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  name: string;
  description: string;
  execution_time: number;
}

export interface SelectedExercise {
  exercise_id: number;
  sets: number;
  reps: number;
}

