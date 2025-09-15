export interface Set {
  targetWeight: number;
  targetReps: number;
  actualWeight?: number;
  actualReps?: number;
  completed?: boolean;
}

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  sets: Set[];
  notes?: string;
  restTime?: number; // in seconds
}

export interface WorkoutSession {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: number; // in minutes
  date: Date;
  completed?: boolean;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  num_of_weeks: number; // in weeks
  schedule: {
    isActive: boolean;
  }[];
  total_exercises: number;
  workouts_per_week: number;
  avg_duration: number;
}

export interface WorkoutHistory {
  id: string;
  name: string;
  date: Date;
  duration: number;
  exercisesCompleted: number;
  totalExercises: number;
  totalVolume: number;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
}

export interface UserStats {
  name: string;
  totalWorkouts: number;
  currentStreak: number;
  personalRecords: number;
  totalVolume: number;
  monthlyWorkouts: number;
  monthlyGoal: number;
  recentAchievements: {
    title: string;
    description: string;
  }[];
}

export interface ExerciseSets {
  set_number: number;
  reps: number;
  weight: number;
}
export interface WorkoutExercises {
  exercise_name: string;
  exercise_sets: Array<ExerciseSets>;
}
export interface WorkoutHistorySupa {
  id: number;
  name: string;
  date: Date;
  expected_number_of_exercises: number;
  actual_number_of_exercises: number;
  total_weight: number;
  workout_exercises: Array<WorkoutExercises>;
  duration: number;
}
