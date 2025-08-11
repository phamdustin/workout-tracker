export interface Set {
  targetWeight: number;
  targetReps: number;
  actualWeight?: number;
  actualReps?: number;
  completed?: boolean;
}

export interface Exercise {
  id: string;
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
  duration: number; // in weeks
  schedule: {
    isActive: boolean;
    workoutType?: string;
  }[];
  totalExercises: number;
  workoutsPerWeek: number;
  avgDuration: number;
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