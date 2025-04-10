import React, { useRef, useEffect, useCallback, useState } from "react";
import styles from "./HabitModal.module.scss"; // Импортируем стили
import { updateHabit, addHabit } from "../../store/habitsSlice";
import { useDispatch, useSelector } from "react-redux";

const HabitModal = ({ habit, isVisible, onClose, onSave, title, setTitle, notes, setNotes, category, setCategory, deadline, setDeadline }) => {
    const modalRef = useRef(null);
    const dispatch = useDispatch();

    // Закрытие модалки при клике вне её
    const handleModalClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isVisible) {
            document.addEventListener("mousedown", handleModalClickOutside);
        } else {
            document.removeEventListener("mousedown", handleModalClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleModalClickOutside);
        };
    }, [isVisible, handleModalClickOutside]);

    if (!isVisible) return null;
    
    // const handleSave = () => {
    //     // Данные, которые нужно обновить для привычки
    //     const updatedHabitData = {
    //         id: habit.id,        // Идентификатор привычки для обновления
    //         title,               // Новое название
    //         notes,               // Новые заметки
    //         category,            // Новая категория
    //         deadline,            // Новый дедлайн
    //         user_id: userId      // Добавляем userId
    //     };
    
    //     // Если ты добавляешь привычку, используешь addHabit
    //     if (!habit.id) {
    //         dispatch(addHabit(updatedHabitData));  // Добавление новой привычки
    //     } else {
    //         dispatch(updateHabit(updatedHabitData));  // Обновление существующей привычки
    //     }
    
    // };

    return (
        <div className={styles.modalOverlay}>
            <div ref={modalRef} className={styles.modal}>
                <div className={styles.heading_container}>
                    <h2 className={styles.heading}>Изменить задачу</h2>
                </div>
                <div className={styles.modal_labels}>
                    <label className={styles.label_text}>
                        Заголовок:
                        <input className={styles.modal_input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label className={styles.label_text}>
                        Заметки:
                        <textarea className={styles.modal_textarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </label>
                    <label className={styles.label_text}>
                        Категория:
                        <select className={styles.modal_options} value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Выберите категорию</option>
                            <option value="Здоровье">Здоровье</option>
                            <option value="Финансы">Финансы</option>
                            <option value="Развитие">Развитие</option>
                        </select>
                    </label>
                    <label className={styles.label_text}>
                        Выполнить до:
                        <input className={styles.modal_input} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </label>
                    <div className={styles.modalButtons}>
                        <button onClick={onClose} className={styles.btn_cancel}>Отмена</button>
                        <button onClick={onSave} className={styles.btn_save}>Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitModal;


// const HabitModal = ({ style, habit }) => {
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);

//     // const [title, setTitle] = useState(habit.title);
//     // const [notes, setNotes] = useState(habit.notes || "");
//     // const [category, setCategory] = useState(habit.category || "");
//     // const [deadline, setDeadline] = useState(habit.deadline || "");

//     // const dispatch = useDispatch();
//     // const userId = useSelector((state) => state.user?.id);

//     // const handleDotsClick = () => {
//     //     setMenuVisible((prev) => !prev);
//     // };

//     // const handleOptionClick = (option) => {
//     //     setMenuVisible(false);
//     //     if (option === "edit") {
//     //         setModalVisible(true);
//     //     }
//     // };

//     // const handleClickOutside = useCallback((event) => {
//     //     if (
//     //         menuRef.current &&
//     //         !menuRef.current.contains(event.target) &&
//     //         dotsButtonRef.current &&
//     //         !dotsButtonRef.current.contains(event.target)
//     //     ) {
//     //         setMenuVisible(false);
//     //     }
//     // }, []);

//     // const handleModalClickOutside = useCallback((event) => {
//     //     if (modalRef.current && !modalRef.current.contains(event.target)) {
//     //         setModalVisible(false);
//     //     }
//     // }, []);

//     // useEffect(() => {
//     //     document.addEventListener("mousedown", handleClickOutside);
//     //     document.addEventListener("mousedown", handleModalClickOutside);
//     //     return () => {
//     //         document.removeEventListener("mousedown", handleClickOutside);
//     //         document.removeEventListener("mousedown", handleModalClickOutside);
//     //     };
//     // }, [handleClickOutside, handleModalClickOutside]);

//     // // Функция для сохранения изменений
//     // const handleSave = () => {
//     //     const updatedHabitData = {
//     //         id: habit.id,
//     //         title,
//     //         notes,
//     //         category,
//     //         deadline,
//     //         user_id: userId,
//     //     };

//     //     if (!habit.id) {
//     //         dispatch(addHabit(updatedHabitData));  // Если это новая привычка
//     //     } else {
//     //         dispatch(updateHabit(updatedHabitData));  // Если это редактирование существующей привычки
//     //     }
//     //     setModalVisible(false); // Закрываем модалку
//     // };

//     return (
//         <>{/* 
//             <div className={styles.habit} style={style}>
//                 Здесь твой основной контент 
//                 <button onClick={handleDotsClick}>...</button>

//                 {menuVisible && (
//                     <div ref={menuRef} className={styles.optionsMenu}>
//                         <button className={styles.option} onClick={() => handleOptionClick("edit")}>
//                             Изменить
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <HabitModal
//                 habit={habit}
//                 isVisible={modalVisible}
//                 onClose={() => setModalVisible(false)}
//                 onSave={handleSave}
//                 title={title}
//                 setTitle={setTitle}
//                 notes={notes}
//                 setNotes={setNotes}
//                 category={category}
//                 setCategory={setCategory}
//                 deadline={deadline}
//                 setDeadline={setDeadline}
//             />*/}
//         </>
//     );
// };


// export default HabitModal;