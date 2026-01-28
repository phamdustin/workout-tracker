/* Used to navigate from routines
  Purpose: View the weekly schedule of the routine, and allow for the user to update with new exercises
  or number of exercises per week.
*/
import React, { useEffect, useContext, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SectionList
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
 
import { router, useLocalSearchParams } from 'expo-router'

import { UserContext } from '@/context/UserContext'
import { Scroll } from 'lucide-react-native'

import {supabase} from '@/utils/supabase'

export default function RoutineSchedule() {
  const { routineId } = useLocalSearchParams();
  const [ routineExercisesInformation, setRoutineExercisesInformation ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortedRoutine, setSortedRoutine] = useState([])

  useEffect(()=> {
    console.log("In viewRoutineSchedule page")
    console.log({routineId})

    async function fetchData() {
      let {data: routineData, error} = await supabase
        .from('routine_exercises')
        .select(`
          routine_id (
          id,
          name,
          workouts_per_week
          ),
          day_num,
          exercise_id (
            id,
            name
          ),
          order_num,
          rep_range
          `)
        .eq('routine_id', routineId)
      if (error) {
        console.error("Error pulling routine exercises information", error) 
      } else {
        setRoutineExercisesInformation(routineData ?? null)
      }
      setLoading(false)
    }
    fetchData()
  }, [routineId]);

  useEffect(()=>{
    if (!loading && routineExercisesInformation) {
      // Sort days by day_num
      const sortedDays = [...routineExercisesInformation].sort( (a,b) => {
        if (a.day_num === b.day_num) {
          return a.order_num - b.order_num
        }
        return a.day_num - b.day_num
      });

      const grouped = sortedDays.reduce((acc, exercise) => {
        const day = exercise.day_num;
        if (!acc[day]) acc[day] = [];
        acc[day].push(exercise);
        return acc;
      }, {});

      const sectionsArray = Object.keys(grouped)
      .sort((a, b) => a - b) // sort days numerically
      .map(dayNum => ({
        title: `Day ${dayNum}`,
        data: grouped[dayNum],
      }));
      setSortedRoutine(sectionsArray)
      console.log(routineExercisesInformation)
    }
    

  }, [loading, routineExercisesInformation])


  return (
    <SafeAreaView>

      <View>
        <Pressable onPress={()=> router.back()}>
          <Text>← Back </Text>
        </Pressable>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <Text style={styles.routineName}>{routineExercisesInformation[0].routine_id.name}</Text>
            <Text style={styles.routineDuration}>{routineExercisesInformation[0].routine_id.workouts_per_week}</Text>
          </View>

          <View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            
/*               routineExercisesInformation.map((routine) => (
                <Text key={routine.exercise_id.name}>
                  {routine.exercise_id.name}
                </Text>
              )) */
              <View style={styles.container}>
                <SectionList
                  sections={sortedRoutine}
                  renderItem={({ item }) => (
                    <Text style={styles.item}>
                      {item.order_num}. {item.exercise_id.name} ({item.rep_range})
                    </Text>
                  )}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                  )}
                />
              </View>
          )}
          </View>
        


        </View>
      </ScrollView>
      )}
    
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  item: { fontSize: 16, marginVertical: 4, paddingLeft: 8 },
  scrollView: {
    flex: 1,
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
})