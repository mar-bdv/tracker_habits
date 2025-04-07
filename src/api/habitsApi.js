import { supabase } from "../supabaseClient"; // Убедись, что у тебя есть подключение

export const createHabit = async (habitData) => {
    const { data, error } = await supabase
        .from("habits")
        .insert([habitData])
        .select(); // можно сразу выбрать данные после вставки
    
    if (error) {
        console.error("Ошибка при добавлении привычки:", error);
        return null;
    }
    
    return data[0]; // Возвращаем созданную привычку
};
