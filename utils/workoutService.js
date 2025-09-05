import { supabase } from './supabase'

export async function addSet(workoutId, set_number, reps, weight) {
    const { data, error } = await supabase
        .from('exercise_sets')
        .insert([{
            workout_exercise_id: workoutId,
            set_number: set_number,
            reps: reps,
            weight: weight
        }])
        .select()

    if (error) {
        console.error(error)
    }
    return data
}

// Takes in 4 arguments: userId, user's name, session's date, expected number of exercises
// Should just return the session id number associated but will need to test what the data returns
export async function newSession(userId,userName, sessionDate = null) {
    // possibly add routine ID into here too
    const { data, error } = await supabase
        .from('sessions')
        .insert([{
            user_id : userId,
            name : userName,
            date : sessionDate,
            routine_id : '0615e257-1dee-41af-b0e3-8b00df1b1779'
        }])
        .select()

    if (error) {
        console.error(error)
    } return data[0].id // returns sessionId
}

// Takes in 5 arguments: userId, exercise's date, exercise's name, exercise's ID in database, session ID in database
export async function addWorkoutExercise(userId, exerciseDate, exerciseName, exerciseId, sessionId) {
    const { data, error } = await supabase
        .from('workout_exercises')
        .insert([{
            user_id : userId,
            exercise_name : exerciseName,
            exercise_id : exerciseId,
            date : exerciseDate,
            session_id : sessionId
        }])

    if (error) {
        return console.error(error)
    } return data
}

// Pull all rows from a workout session
export async function pullWorkout(userId) {
    const { data, error } = await supabase
        .from('sessions')
        .select(`
            name,
            date,
            expected_number_of_exercises,
            actual_number_of_exercises,
            total_weight,
            duration,
            workout_exercises (
                exercise_name,
                exercise_sets (
                    set_number,
                    reps,
                    weight)
            )
            
            `)
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching workouts:', error)
        return []
    }
    console.log('pullworkout function data: ', data)
    return data
}

