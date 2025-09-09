import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Plus, Minus, Check } from 'lucide-react-native';
import { Exercise } from '@/types/workout';
import { addSet, addWorkoutExercise, pullExerciseId } from '@/utils/workoutService'
import { UserContext } from '@/context/UserContext';
interface ExerciseCardProps {
  exercise: Exercise;
  exerciseNumber: number;
  isCompleted: boolean;
  onComplete: (totalWeight: number) => void;
}

/* 
  Takes in 4 inputs
    exercise -> exercise from routine includes 
      id
      name
      musclegroup
      sets : [{target weight, target reps}]
      notes
      rest time
    exerciseNumber -> numerical order of workout on routine
    isCompleted -> True/False if it is completed

    onComplete is a void function that tells the parent
    component when something is completed and to do smth
*/
export default function ExerciseCard({ 
  exercise, 
  exerciseNumber, 
  isCompleted, 
  onComplete 
}: ExerciseCardProps) {

  // takes information from the workout data and sets this up
  const [sets, setSets] = useState(
    exercise.sets.map(set => ({
      ...set,
      actualWeight: set.targetWeight,
      actualReps: set.targetReps,
      completed: false,
    }))
  );

  const { userInfo } = useContext(UserContext)
  const { sessionId } = useContext(UserContext)

  // updates individual sets' weight or reps
  const updateSet = (setIndex: number, field: 'actualWeight' | 'actualReps', value: number) => {
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, [field]: value } : set
    ));
    console.log(exercise)
  };

  // updates individual set to True/False
  const toggleSetComplete = (setIndex: number) => {
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? 
      { ...set, completed: !set.completed } : set
    ));
    // make a POST to the database to update the information
    // const newSet = sets[setIndex]
    // using 1 as a tester for now
    // addSet(1, setIndex, newSet.actualReps, newSet.actualWeight)
     
  };

  const allSetsCompleted = sets.every(set => set.completed);


  // Maybe instead of sending information after each exercise, send after workout is complete?
  // Need to create new workout_exercise entry here using addWorkoutExercise from workoutService
  const handleExerciseComplete = async () => {
    if (allSetsCompleted) {
      var totalWeight = 0
      sets.map((set, index) => {
        totalWeight += set.actualWeight
      })
      onComplete(totalWeight);
    }
    console.log("Session Id: ", sessionId)
    console.log("User ID: ", userInfo.user_id)
    const exercise_id = parseInt( await pullExerciseId(exercise.name))
    const workout_exercise_id = await addWorkoutExercise(userInfo.user_id, '2025-09-09', exercise.name, exercise_id, sessionId)
    //console.log(workout_exercise_id)

    sets.map((set, index) => {
      addSet(workout_exercise_id, index+1, set.actualReps, set.actualWeight)
    })
    console.log("Added all sets from this exercise to database") 
  };

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.header}>
        <View style={styles.exerciseInfo}>
          <View style={styles.exerciseNumber}>
            <Text style={styles.exerciseNumberText}>{exerciseNumber}</Text>
          </View>
          <View>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
          </View>
        </View>
        
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Check size={20} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.setsContainer}>
        <View style={styles.setsHeader}>
          <Text style={styles.setHeaderText}>Set</Text>
          <Text style={styles.setHeaderText}>Previous</Text>
          <Text style={styles.setHeaderText}>Rep Range</Text>
          <Text style={styles.setHeaderText}>Weight (lbs)</Text>
          <Text style={styles.setHeaderText}>Reps</Text>
          <Text style={styles.setHeaderText}>✓</Text>
        </View>

        {sets.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text style={styles.setNumber}>{setIndex + 1}</Text>
            
            <Text style={styles.previousText}>
              {set.targetWeight} × {set.targetReps}
            </Text>

            {/* Needs to be fixed to have accurate rep ranges for each individual exercise */}
            <Text style={styles.previousText}>
              8-12
            </Text>

            {/* Weight Input */}
            <View style={styles.inputContainer}>
              
              <TextInput
                style={styles.input}
                value={set.actualWeight.toString()}
                onChangeText={(text) => updateSet(setIndex, 'actualWeight', parseInt(text) || 0)}
                keyboardType="numeric"
                textAlign="center"
              />
              

            </View>

            {/* Reps Input */}
            <View style={styles.inputContainer}>

              
              <TextInput
                style={styles.input}
                value={set.actualReps.toString()}
                onChangeText={(text) => updateSet(setIndex, 'actualReps', parseInt(text) || 0)}
                keyboardType="numeric"
                textAlign="center"
              />
              

            </View>

            {/* Complete Set Button */}
            <TouchableOpacity
              style={[
                styles.completeSetButton,
                set.completed && styles.completedSetButton
              ]}
              onPress={() => toggleSetComplete(setIndex)}
            >
              {set.completed && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {allSetsCompleted && !isCompleted && (
        <TouchableOpacity
          style={styles.finishExerciseButton}
          onPress={handleExerciseComplete}
        >
          <Text style={styles.finishExerciseText}>Complete Exercise</Text>
        </TouchableOpacity>
      )}

      {exercise.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{exercise.notes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  muscleGroup: {
    fontSize: 14,
    color: '#64748B',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setsContainer: {
    marginBottom: 16,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  setHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    flex: 1,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
    textAlign: 'center',
  },
  previousText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  adjustButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginHorizontal: 4,
  },
  completeSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  completedSetButton: {
    backgroundColor: '#059669',
  },
  finishExerciseButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  finishExerciseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});