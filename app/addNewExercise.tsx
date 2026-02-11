/*
  Purpose: Screen for adding new exercise to current routine

*/

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Button
  
 } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
export default function NewWorkout() {
  interface Exercise {
    id: number,
    name: string,
    category: string[]

  }
  const [exerciseName, setExerciseName ] = useState("")
  const [listOfExercises, setListOfExercises] = useState<Exercise[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const exerciseTextBoxChange = (event: any) => {
    setExerciseName(event.target.value)
  }
  useEffect(() => {
    console.log("addNewExercise")

    async function fetchExerciseList() {
      let {data: exercises, error} = await supabase
        .from('exercises')
        .select(`
          id,
          name,
          category`)
        .like('name', '%'+exerciseName+'%')
      if (error) {
        console.error("Error pulling from supabase: list of exercises", error)

      } else {
        setListOfExercises(exercises || [])
      }
    }
    fetchExerciseList()
  }, [exerciseName])
  
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day) // remove
        : [...prev, day]                // add
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Pressable onPress={() => router.back()}>
          <Text>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.inputTextContainer}>
        <TextInput
          placeholder="Input exercise name"
          onChange={exerciseTextBoxChange}
          style={styles.inputText}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle = {styles.scrollContent}
        >
          {listOfExercises.map((exercise,index) => (
            <Pressable key={index} onPress= {() => console.log("pressed")}>
              <Text>{exercise.name}</Text>
            </Pressable>
          ))}

      </ScrollView>

      <View style={styles.weekdayButtonsContainer}>
        {weekdays.map((day, index) => {
          const isSelected = selectedDays.includes(day)

          return (
          <View style={styles.dayChip}>
              <Pressable 
                key={day}
                  style={() => 
                  [styles.button,
                   isSelected ? styles.activeDayChip : styles.inactiveDayChip,

                  ]}
                onPress={() => toggleDay(day)}
              >
                <Text>{day}</Text>
              </Pressable>
          </View>
          )
        }
        ) }


      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inputTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText:{
    backgroundColor: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 15,
    padding: 5,
    width: '80%',
    borderRadius: '10px',
  },
  scrollView: {
    backgroundColor: 'white',
    maxHeight: 250
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
    height: 16
  },
  weekdayButtonsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  dayChip: {
    borderRadius: 3,
    padding: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  activeDayChip: {
    backgroundColor: '#2563EB',
  },
  inactiveDayChip: {
    backgroundColor: '#F1F5F9',
  },
  button: {
    paddingVertical: 8,
    width: 35,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',

  }
})