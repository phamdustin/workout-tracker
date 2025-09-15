import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, Filter } from 'lucide-react-native';
import { getWorkoutHistory, getPersonalRecords } from '@/utils/workoutData';
import { WorkoutHistory, PersonalRecord, WorkoutHistorySupa} from '@/types/workout';

import { pullWorkout } from '@/utils/workoutService'

import { UserContext } from '@/context/UserContext';
export default function HistoryScreen() {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistorySupa[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month'>('all');

  const { userInfo } = useContext(UserContext)

  useEffect(() => {
    setHistory(getWorkoutHistory());
    setPersonalRecords(getPersonalRecords());

    if (!userInfo) return

    async function fetchData() {
      console.log(userInfo)
      const  data  = await pullWorkout(userInfo.user_id)
      console.log(data)
      setWorkoutHistory(data)
    }
    fetchData()
  }, [userInfo]);

  // Not needed, but just used to log
  useEffect(() => {
    console.log("workoutHistory changed", workoutHistory)
  }, [workoutHistory])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredHistory = history.filter(workout => {
    const workoutDate = workout.date;
    const now = new Date();
    
    switch (selectedFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return workoutDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return workoutDate >= monthAgo;
      default:
        return true;
    }
  });

  if (!userInfo) {
    return <Text>Loading...</Text>
  }
  
  const handlePress = () => {
    console.log("workout history pressed")
    return (
      <View>
        <p>text</p>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.subtitle}>Track your progress and achievements</Text>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#64748B" />
        </TouchableOpacity>
        
        {['all', 'week', 'month'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setSelectedFilter(filter as any)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personal Records Section  */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Personal Records</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recordsScroll}>
            {personalRecords.map((record) => (
              <View key={record.exerciseName} style={styles.recordCard}>
                <Text style={styles.recordExercise}>{record.exerciseName}</Text>
                <Text style={styles.recordValue}>
                  {record.weight}lbs
                </Text>
                <Text style={styles.recordReps}>
                  {record.reps} reps
                </Text>
                <Text style={styles.recordDate}>
                  {formatDate(record.date)}
                </Text>
              </View>
            ))}
          </ScrollView> 
        </View> */}

        {/* Workout History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
          </View>
          
          {/* {filteredHistory.map((workoutHistory) => ( */}
          {workoutHistory.map((workout) => (
            <TouchableOpacity key={workout.id} style={styles.historyCard} onPress={handlePress}>
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.historyTitle}>{workout.name}</Text>
                  <Text style={styles.historyDate}>
                    {workout.date}
                    {/* {formatDate(workout.date)} */}
                  </Text>
                </View>
                <View style={styles.completionBadge}>
                  <Text style={styles.completionText}>
                    {Math.round((workout.actual_number_of_exercises / workout.expected_number_of_exercises) * 100)}%  
                  </Text>
                </View>
              </View>
              
              <View style={styles.historyStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{workout.actual_number_of_exercises}</Text>
                  <Text style={styles.statLabel}>Exercises</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{workout.duration} min</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{workout.total_weight}</Text>
                  <Text style={styles.statLabel}>Volume (lbs)</Text>
                </View>
              </View>

              {workout.workout_exercises && (
                <View style={styles.workoutStats}>
                  <View>     
                    {workout.workout_exercises.map((exercise) => (    
                      <View key={exercise.exercise_name}>
                        <Text style={styles.statValue}>{exercise.exercise_name}</Text> 

                        {exercise.exercise_sets.map((set) => (
                          <View style={{flexDirection:'row'}}>
                            <Text>Set {set.set_number}: </Text>
                            <Text>{set.reps} reps @ {set.weight}</Text>
                          </View>
                        ))}
                        </View>
                      ))}  
                  </View> 
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  recordsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recordExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  recordValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 2,
  },
  recordReps: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: '#64748B',
  },
  completionBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  }
});