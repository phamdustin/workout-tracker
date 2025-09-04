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

