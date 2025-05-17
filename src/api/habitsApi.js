import { supabase } from "../supabaseClient";

export const createHabit = async (habitData) => {
    const { data, error } = await supabase
        .from("habits")
        .insert([habitData])
        .select();
    
    if (error) {
        console.error("Ошибка при добавлении привычки:", error);
        return null;
    }
    
    return data[0];
};
