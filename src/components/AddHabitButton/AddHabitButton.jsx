import { useState } from "react";
import styles from "./AddHabitButton.module.scss";


const AddHabitButton = ({ onAdd }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [habitName, setHabitName] = useState("");
    console.log(onAdd)

    const handleAddHabit = () => {
        if (habitName.trim() !== "") {
            onAdd(habitName);
            setHabitName(""); // Очищаем поле ввода
            setIsEditing(false); // Возвращаем кнопку в исходное состояние
        }
    };

    return (
        <div className={styles.button_container}>
            {/* <button className={styles.button}>Добавить новую привычку</button> */}
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
    )
}

export default AddHabitButton;