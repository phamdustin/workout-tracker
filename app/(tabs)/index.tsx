// Workout tab

import React, { useState, useEffect, useContext, useRef } from 'react';
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
import WorkoutHeader, {ChildHandle} from '@/components/WorkoutHeader';
import { getTodaysWorkout } from '@/utils/workoutData';
import { Exercise, WorkoutSession } from '@/types/workout';
import { supabase } from '@/utils/supabase'
import 'bootstrap/dist/css/bootstrap.min.css'

import { completeWorkout } from '@/utils/workoutService';
import { UserContext } from '@/context/UserContext';

export default function WorkoutScreen() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [totalWeight, setTotalWeight] = useState(0)
  const [user, setUsers] = useState([]);
  
  const [completeWorkoutTrigger, setCompleteWorkoutTrigger] = useState(false)

  const { sessionId } = useContext(UserContext)
  const headerRef = useRef<ChildHandle>(null)

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


  const handleExerciseComplete = (exerciseId: number, total_Weight: number) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    setTotalWeight(totalWeight+total_Weight)
    console.log(`Current Exercise list ${[...completedExercises]}`);
    console.log(`total weight is currently ${totalWeight}`)
  };

  const handleCompleteWorkout = () => {
    // Need to update session in database with number of exercises, and total weight
    // On this side it would gather data to complete, stop timer, and show some way that its complete

    /* if (currentWorkout) {
      completeWorkout(currentWorkout.id);
      // Reset for next workout
      setCompletedExercises(new Set());
    } */
    const num_of_exercises = completedExercises.size
    const total_Weight = totalWeight
    setCompleteWorkoutTrigger(true)
    var timerValue = 0
    if (headerRef.current) {
      timerValue = headerRef.current.getTimerValue()

    }
    console.log("Parent received timer:", timerValue)
    completeWorkout(sessionId, total_Weight, num_of_exercises, timerValue);
    
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
        ref={headerRef} 
        title={currentWorkout.name}
        subtitle={currentWorkout.description}
        duration={currentWorkout.estimatedDuration}
        workoutCompleteTrigger={completeWorkoutTrigger}
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
            onComplete={(totalWeight) => handleExerciseComplete(exercise.id, totalWeight)}
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