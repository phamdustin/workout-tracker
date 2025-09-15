import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar } from 'lucide-react-native';
import { getRoutines } from '@/utils/workoutService';
import { WorkoutRoutine } from '@/types/workout';

export default function RoutinesScreen() {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);

  useEffect(() => {
    async function grabRoutines() {
      const data = await getRoutines()
      console.log(data)
      setRoutines(data)
    }
    grabRoutines()
    
  }, []);

  const getDayLabel = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const handleRoutinePress = () => {
    // Intention: When ran, it will pull the exercises associated to routine
    // in a different screen than the routine screen.

    console.log("handling Routine Press")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Routines</Text>
        <Text style={styles.subtitle}>Manage your training programs</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#2563EB" />
          <Text style={styles.addButtonText}>Create New Routine</Text>
        </TouchableOpacity>

        {routines.map((routine) => (
          <TouchableOpacity key={routine.id} onPress={handleRoutinePress}>
          <View key={routine.id} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Text style={styles.routineName}>{routine.name}</Text>
              <Text style={styles.routineDuration}>{routine.num_of_weeks} weeks</Text>
            </View>
            
            <Text style={styles.routineDescription}>{routine.description}</Text>
            
            <View style={styles.weeklySchedule}>
              <View style={styles.scheduleHeader}>
                <Calendar size={16} color="#64748B" />
                <Text style={styles.scheduleTitle}>Weekly Schedule</Text>
              </View>
              
              <View style={styles.dayGrid}>
                {routine.schedule.map((day, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dayChip,
                      day.isActive ? styles.activeDayChip : styles.inactiveDayChip
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        day.isActive ? styles.activeDayText : styles.inactiveDayText
                      ]}
                    >
                      {getDayLabel(index)}
                    </Text>
          
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.routineStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{routine.total_exercises}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{routine.workouts_per_week}</Text>
                <Text style={styles.statLabel}>Days/Week</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{routine.avg_duration}min</Text>
                <Text style={styles.statLabel}>Avg Duration</Text>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        ))}
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
  scrollView: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 8,
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  routineDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EBF3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  routineDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  weeklySchedule: {
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 6,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    borderRadius: 8,
    padding: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  activeDayChip: {
    backgroundColor: '#2563EB',
  },
  inactiveDayChip: {
    backgroundColor: '#F1F5F9',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  inactiveDayText: {
    color: '#94A3B8',
  },
  workoutTypeText: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 2,
  },
  routineStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
});