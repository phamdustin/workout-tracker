import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseCard from '@/components/ExerciseCard';
import WorkoutHeader from '@/components/WorkoutHeader';
import { getTodaysWorkout, completeWorkout } from '@/utils/workoutData';
import { Exercise, WorkoutSession } from '@/types/workout';
import { supabase } from '@/utils/supabase'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function WorkoutScreen() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [user, setUsers] = useState([]);

  useEffect(() => {
    const workout = getTodaysWorkout();
    setCurrentWorkout(workout);

    async function fetchData() {
        let {data, error} = await supabase
          .from('testing_table')
          .select('*')
      if (error) {
        console.error(error)
      } else if (data) {
        setUsers(data)
        console.log(data)
      }

      }

    fetchData();
    
  }, []);


  const handleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
  };

  const handleCompleteWorkout = () => {
    if (currentWorkout) {
      completeWorkout(currentWorkout.id);
      // Reset for next workout
      setCompletedExercises(new Set());
    }
  };

  const isWorkoutComplete = currentWorkout?.exercises.every(exercise => 
    completedExercises.has(exercise.id)
  );

  if (!currentWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Workout Today</Text>
          <Text style={styles.emptySubtitle}>Your rest day! Check back tomorrow.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <WorkoutHeader 
        title={currentWorkout.name}
        subtitle={currentWorkout.description}
        duration={currentWorkout.estimatedDuration}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentWorkout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={index + 1}
            isCompleted={completedExercises.has(exercise.id)}
            onComplete={() => handleExerciseComplete(exercise.id)}
          />
        ))}

        {isWorkoutComplete && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteWorkout}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});