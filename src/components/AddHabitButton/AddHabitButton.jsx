
import { useState } from "react";
import styles from "./AddHabitButton.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit } from "../../store/habitsSlice"
import { motion } from "motion/react"


const AddHabitButton = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [habitName, setHabitName] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleAddHabit = () => {
        if (!user) {
            console.error("Ошибка: user отсутствует!"); 
            alert("Вы не авторизованы!");
            return;
        }

        console.log("user.id перед отправкой:", user.id);

        if (habitName.trim() !== "") {
            dispatch(addHabit({ title: habitName, user_id: String(user.id) }));
            setHabitName("");
            setIsEditing(false);
        }
    };

    return (
        <div className={styles.button_container}>
            {isEditing ? (
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        placeholder="Введите привычку..."
                        className={styles.input}
                    />
                    <button onClick={handleAddHabit} className={styles.addButton}>+</button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className={styles.button}>
                    Добавить привычку
                </button>
            )}
        </div>
    );
};

export default AddHabitButton;
