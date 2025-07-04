import { Workout } from './Workout'
import { WorkoutExerciseDetail } from './WorkoutExercise'

export interface WorkoutWithExercises extends Workout {
  exercises?: WorkoutExerciseDetail[]
  workout_exercises?: Array<{
    id: number
    sets: number
    reps: number
    exercises: {
      id: number
      name: string
      description: string
      execution_time: number
    }
  }>
}
