import { supabase } from './supabase'

export async function addSet(workoutId, set_number, reps, weight) {
    const { data, error } = await supabase
        .from('exercise_sets')
        .insert([{
            workout_id: workoutId,
            set_number: set_number,
            reps: reps,
            weight: weight
        }])
        .select()

    if (error) {
        throw new Error(`HTTP error! status: ${response.status}`);
        
    }
    return data[0]
}

// Pull all rows from a workout session
export async function pullWorkout(userId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching workouts:', error)
        return []
    }
    console.log('pullworkout function data: ', data)
    return data
}

