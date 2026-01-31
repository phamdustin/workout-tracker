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
  ScrollView
 } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
export default function NewWorkout() {
  const [exerciseName, setExerciseName ] = useState("")
  const [listOfExercises, setListOfExercises] = useState([])

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
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Pressable onPress={() => router.back()}>
          <Text>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text>Form here</Text>
        <TextInput
          placeholder="Exercise name"
          onChange={exerciseTextBoxChange}
          style={styles.inputTextContainer}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle = {styles.scrollContent}
        >
          {listOfExercises.map((exercise) => (
            <Text>{exercise.name}</Text>
          ))}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inputTextContainer:{
    backgroundColor: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1
  },
})