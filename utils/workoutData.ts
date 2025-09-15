import { 
  WorkoutSession, 
  WorkoutRoutine, 
  WorkoutHistory, 
  PersonalRecord, 
  UserStats 
} from '@/types/workout';


// Sample workout data - in a real app, this would come from a database
export const getTodaysWorkout = (): WorkoutSession | null => {
  const today = new Date().getDay();
  
  // Return different workouts based on day of week
  const workouts: { [key: number]: WorkoutSession } = {
    1: { // Monday - Push Day
      id: 'push-monday',
      name: 'Push Day',
      description: 'Chest, Shoulders, and Triceps',
      estimatedDuration: 75,
      date: new Date(),
      exercises: [
        {
          id: 1,
          name: 'Bench Press',
          muscleGroup: 'Chest',
          sets: [
            { targetWeight: 135, targetReps: 8 },
            { targetWeight: 155, targetReps: 6 },
            { targetWeight: 175, targetReps: 4 },
            { targetWeight: 155, targetReps: 6 },
          ],
          notes: 'Focus on controlled movement and full range of motion',
          restTime: 180,
        },
        {
          id: 4,
          name: 'Shoulder Press',
          muscleGroup: 'Shoulders',
          sets: [
            { targetWeight: 95, targetReps: 8 },
            { targetWeight: 115, targetReps: 6 },
            { targetWeight: 125, targetReps: 4 },
          ],
          restTime: 120,
        },
        {
          id: 2,
          name: 'Incline Dumbbell Press',
          muscleGroup: 'Chest',
          sets: [
            { targetWeight: 60, targetReps: 10 },
            { targetWeight: 70, targetReps: 8 },
            { targetWeight: 80, targetReps: 6 },
          ],
          restTime: 90,
        },
        {
          id: 5,
          name: 'Lateral Raises',
          muscleGroup: 'Shoulders',
          sets: [
            { targetWeight: 20, targetReps: 15 },
            { targetWeight: 25, targetReps: 12 },
            { targetWeight: 30, targetReps: 10 },
          ],
          restTime: 60,
        },
        {
          id: 6,
          name: 'Tricep Dips',
          muscleGroup: 'Triceps',
          sets: [
            { targetWeight: 0, targetReps: 12 },
            { targetWeight: 0, targetReps: 10 },
            { targetWeight: 0, targetReps: 8 },
          ],
          notes: 'Add weight if bodyweight becomes too easy',
          restTime: 60,
        },
      ],
    },
    3: { // Wednesday - Pull Day
      id: 'pull-wednesday',
      name: 'Pull Day',
      description: 'Back, Biceps, and Rear Delts',
      estimatedDuration: 70,
      date: new Date(),
      exercises: [
        {
          id: 11,
          name: 'Deadlift',
          muscleGroup: 'Back',
          sets: [
            { targetWeight: 185, targetReps: 5 },
            { targetWeight: 225, targetReps: 3 },
            { targetWeight: 275, targetReps: 1 },
          ],
          notes: 'Maintain proper form, engage core throughout',
          restTime: 180,
        },
        {
          id: 12,
          name: 'Pull-ups',
          muscleGroup: 'Back',
          sets: [
            { targetWeight: 0, targetReps: 8 },
            { targetWeight: 0, targetReps: 6 },
            { targetWeight: 0, targetReps: 4 },
          ],
          restTime: 120,
        },
        {
          id: 13,
          name: 'Barbell Rows',
          muscleGroup: 'Back',
          sets: [
            { targetWeight: 135, targetReps: 10 },
            { targetWeight: 155, targetReps: 8 },
            { targetWeight: 175, targetReps: 6 },
          ],
          restTime: 90,
        },
        {
          id: 14,
          name: 'Bicep Curls',
          muscleGroup: 'Biceps',
          sets: [
            { targetWeight: 30, targetReps: 12 },
            { targetWeight: 35, targetReps: 10 },
            { targetWeight: 40, targetReps: 8 },
          ],
          restTime: 60,
        },
      ],
    },
    5: { // Friday - Legs Day
      id: 'legs-friday',
      name: 'Leg Day',
      description: 'Quads, Hamstrings, Glutes, and Calves',
      estimatedDuration: 80,
      date: new Date(),
      exercises: [
        {
          id: 4,
          name: 'Back Squats',
          muscleGroup: 'Quads',
          sets: [
            { targetWeight: 135, targetReps: 10 },
            { targetWeight: 185, targetReps: 8 },
            { targetWeight: 225, targetReps: 6 },
            { targetWeight: 185, targetReps: 8 },
          ],
          notes: 'Go to parallel or below, keep chest up',
          restTime: 180,
        },
        {
          id: 8,
          name: 'Romanian Deadlift',
          muscleGroup: 'Hamstrings',
          sets: [
            { targetWeight: 135, targetReps: 12 },
            { targetWeight: 155, targetReps: 10 },
            { targetWeight: 175, targetReps: 8 },
          ],
          restTime: 120,
        },
        {
          id: 9,
          name: 'Bulgarian Split Squats',
          muscleGroup: 'Quads',
          sets: [
            { targetWeight: 40, targetReps: 10 },
            { targetWeight: 50, targetReps: 8 },
            { targetWeight: 60, targetReps: 6 },
          ],
          notes: 'Each leg - focus on single leg stability',
          restTime: 90,
        },
        {
          id: 10,
          name: 'Calf Raises',
          muscleGroup: 'Calves',
          sets: [
            { targetWeight: 45, targetReps: 15 },
            { targetWeight: 45, targetReps: 12 },
            { targetWeight: 45, targetReps: 10 },
          ],
          restTime: 45,
        },
      ],
    },
  };

  return workouts[5] || null;
};

/* export const getWorkoutRoutines = (): WorkoutRoutine[] => {
  return [
    {
      id: 'push-pull-legs',
      name: 'Push/Pull/Legs',
      description: 'Classic 3-day split focusing on compound movements',
      duration: 12,
      schedule: [
        { isActive: false }, // Sunday
        { isActive: true, workoutType: 'Push' }, // Monday
        { isActive: false }, // Tuesday
        { isActive: true, workoutType: 'Pull' }, // Wednesday
        { isActive: false }, // Thursday
        { isActive: true, workoutType: 'Legs' }, // Friday
        { isActive: false }, // Saturday
      ],
      totalExercises: 15,
      workoutsPerWeek: 3,
      avgDuration: 75,
    },
    {
      id: 'upper-lower',
      name: 'Upper/Lower Split',
      description: '4-day split alternating upper and lower body',
      duration: 8,
      schedule: [
        { isActive: false }, // Sunday
        { isActive: true, workoutType: 'Upper' }, // Monday
        { isActive: true, workoutType: 'Lower' }, // Tuesday
        { isActive: false }, // Wednesday
        { isActive: true, workoutType: 'Upper' }, // Thursday
        { isActive: true, workoutType: 'Lower' }, // Friday
        { isActive: false }, // Saturday
      ],
      totalExercises: 20,
      workoutsPerWeek: 4,
      avgDuration: 60,
    },
  ];
};
 */
export const getWorkoutHistory = (): WorkoutHistory[] => {
  const baseDate = new Date();
  return [
    {
      id: 'history-1',
      name: 'Push Day',
      date: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      duration: 72,
      exercisesCompleted: 5,
      totalExercises: 5,
      totalVolume: 8240,
    },
    {
      id: 'history-2',
      name: 'Pull Day',
      date: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
      duration: 68,
      exercisesCompleted: 4,
      totalExercises: 4,
      totalVolume: 7560,
    },
    {
      id: 'history-3',
      name: 'Leg Day',
      date: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      duration: 85,
      exercisesCompleted: 4,
      totalExercises: 4,
      totalVolume: 9120,
    },
    {
      id: 'history-4',
      name: 'Push Day',
      date: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000),
      duration: 70,
      exercisesCompleted: 5,
      totalExercises: 5,
      totalVolume: 8050,
    },
  ];
};

export const getPersonalRecords = (): PersonalRecord[] => {
  return [
    {
      exerciseName: 'Bench Press',
      weight: 185,
      reps: 3,
      date: new Date(2025, 0, 15),
    },
    {
      exerciseName: 'Deadlift',
      weight: 315,
      reps: 1,
      date: new Date(2025, 0, 10),
    },
    {
      exerciseName: 'Back Squat',
      weight: 245,
      reps: 5,
      date: new Date(2025, 0, 8),
    },
    {
      exerciseName: 'Overhead Press',
      weight: 135,
      reps: 3,
      date: new Date(2025, 0, 5),
    },
  ];
};

export const getUserStats = (): UserStats => {
  return {
    name: 'Alex Johnson',
    totalWorkouts: 47,
    currentStreak: 12,
    personalRecords: 8,
    totalVolume: 425,
    monthlyWorkouts: 14,
    monthlyGoal: 16,
    recentAchievements: [
      {
        title: 'New PR!',
        description: 'Hit a new personal record on Bench Press: 185lbs',
      },
      {
        title: 'Consistency Champion',
        description: 'Completed 12 workouts in a row without missing a day',
      },
      {
        title: 'Volume Milestone',
        description: 'Reached 400k total pounds lifted',
      },
    ],
  };
};

export const completeWorkout = (workoutId: string): void => {
  // In a real app, this would save to database
  console.log(`Workout ${workoutId} completed!`);
};