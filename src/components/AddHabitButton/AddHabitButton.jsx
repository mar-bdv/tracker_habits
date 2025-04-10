// import { useState } from "react";
// import styles from "./AddHabitButton.module.scss";
// import { useDispatch } from "react-redux";
// import { addHabitAsync } from "../../store/habitsSlice";



// const AddHabitButton = ({ userId }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [habitName, setHabitName] = useState("");
//     const dispatch = useDispatch();

//     const handleAddHabit = () => {
//         if (habitName.trim() !== "") {
//             dispatch(addHabitAsync({ title: habitName, user_id: userId }));
//             setHabitName("");
//             setIsEditing(false);
//         }
//     };

//     return (
//         <div className={styles.button_container}>
//             {isEditing ? (
//                 <div className={styles.inputContainer}>
//                     <input
//                         type="text"
//                         value={habitName}
//                         onChange={(e) => setHabitName(e.target.value)}
//                         placeholder="Введите привычку..."
//                         className={styles.input}
//                     />
//                     <button onClick={handleAddHabit} className={styles.addButton}>+</button>
//                 </div>
//             ) : (
//                 <button onClick={() => setIsEditing(true)} className={styles.button}>
//                     Добавить привычку
//                 </button>
//             )}
//         </div>
//     );
// };

// export default AddHabitButton;

import { useState } from "react";
import styles from "./AddHabitButton.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit } from "../../store/habitsSlice"

const AddHabitButton = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [habitName, setHabitName] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user); // Получаем текущего пользователя

    const handleAddHabit = () => {
        if (!user) {
          console.error("Ошибка: user отсутствует!"); // <-- Добавь этот лог
            alert("Вы не авторизованы!");
            return;
        }

        console.log("user.id перед отправкой:", user.id); // <-- Проверяем, какой `user_id` передаётся

        if (habitName.trim() !== "") {
            dispatch(addHabit({ title: habitName, user_id: String(user.id) }));
            setHabitName("");
            setIsEditing(false);
        }
    };

    return (
        <div className={styles.button_container}>
            <p>{habitName}</p>
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


// const AddHabitButton = ({ onAdd, userId }) => {

//     const [isEditing, setIsEditing] = useState(false);
//     const [habitName, setHabitName] = useState("");

//     const handleAddHabit = () => {
//         if (habitName.trim() !== "") {
//             onAdd({ habitName, userId });
//             setHabitName(""); // Очищаем поле ввода
//             setIsEditing(false); // Возвращаем кнопку в исходное состояние
//         }
//     };

//     return (
//         <div className={styles.button_container}>
//             {isEditing ? (
//                 <div className={styles.inputContainer}>
//                     <input
//                         type="text"
//                         value={habitName}
//                         onChange={(e) => setHabitName(e.target.value)}
//                         placeholder="Введите привычку..."
//                         className={styles.input}
//                     />
//                     <button onClick={handleAddHabit} className={styles.addButton}>+</button>
//                 </div>
//             ) : (
//                 <button onClick={() => setIsEditing(true)} className={styles.button}>
//                     Добавить привычку
//                 </button>
//             )}
//         </div>
//     )
// }

// export default AddHabitButton;