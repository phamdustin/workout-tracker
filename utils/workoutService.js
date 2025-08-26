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