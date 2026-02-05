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
  const [exerciseName, setExerciseName ] = useState("")
  const [listOfExercises, setListOfExercises] = useState([])
  const [selectedDays, setSelectedDays] = useState([])

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
        setListOfExercises(exercises ?? null)
      }
    }
    fetchExerciseList()
  }, [exerciseName])
  
  const toggleDay = (day) => {
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
          {listOfExercises.map((exercise) => (
            <Text>{exercise.name}</Text>
          ))}

      </ScrollView>

      <View style={styles.weekdayButtonsContainer}>
        {weekdays.map((day, index) => {
          const isSelected = selectedDays.includes(day)

          return (
          <Text>{day} 
            <Pressable 
              key={day}
                style={() => 
                [styles.button,
                { 
                  backgroundColor: isSelected ? 'green' : 'gray',
                },
                ]}
              onPress={() => toggleDay(day)}
            >
              <Text> </Text>
            </Pressable>
          </Text>
          )
        }

        ) }
{/*         <Pressable style={() => 
          [styles.button,
          { 
            backgroundColor: monPressed ? 'green' : 'gray',
          },
          ]}
          onPress={handleButtonPressed}
        >
          <Text>Mon</Text>
        </Pressable>
        <Button title="Tue" />
        <Button title="Wed" />
        <Button title="Thu" />
        <Button title="Fru" />
        <Button title="Sat" />
        <Button title="Sun" /> */}


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
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1
  },
  weekdayButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',

  }
})