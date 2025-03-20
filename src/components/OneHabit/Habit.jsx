import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleHabit, updateHabit } from "../../store/habitsSlice"
import styles from "./Habit.module.scss";
import threeDotes from '../../images/three_dotes.png'

const Habit = ({ style, habit }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Локальное состояние для редактирования
    const [title, setTitle] = useState(habit.name);
    const [notes, setNotes] = useState(habit.notes || "");
    const [category, setCategory] = useState(habit.category || "");
    const [deadline, setDeadline] = useState(habit.deadline || "");

    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const dotsButtonRef = useRef(null);
    const modalRef = useRef(null);

    const handleDotsClick = () => {
        setMenuVisible((prev) => !prev);
    };

    const handleOptionClick = (option) => {
        setMenuVisible(false);
        if (option === "edit") {
            setModalVisible(true);
        }
    };

    // Закрытие меню при клике вне его
    const handleClickOutside = useCallback((event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            dotsButtonRef.current &&
            !dotsButtonRef.current.contains(event.target)
        ) {
            setMenuVisible(false);
        }
    }, []);

    // Закрытие модального окна при клике вне его
    const handleModalClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setModalVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mousedown", handleModalClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleModalClickOutside);
        };
    }, [handleClickOutside, handleModalClickOutside]);

    // Функция для сохранения изменений
    const handleSave = () => {
        dispatch(updateHabit({ id: habit.id, updatedData: { name: title, notes, category, deadline } }));
        setModalVisible(false); // Закрываем модалку после сохранения
    };

    return (
        <>
            <div className={styles.habit} style={style}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={habit.completed}
                        className={styles.checkbox_habit}
                        onChange={() => dispatch(toggleHabit(habit.id))}
                    />
                    <span className={styles.customCheckbox}></span>
                </label>
                <div className={styles.habit_text}>
                    <p className={styles.name_habit}>{habit.name}</p>
                    {habit.notes && <p className={styles.notes_habit}>{habit.notes}</p>}
                    {habit.deadline && <p className={styles.deadline_habit}>До {new Date(habit.deadline).toLocaleDateString()}</p>}
                </div>
                <button ref={dotsButtonRef} className={styles.dotsButton} onClick={handleDotsClick}>
                    <img src={threeDotes} alt="Меню" />
                </button>

                {menuVisible && (
                    <div ref={menuRef} className={styles.optionsMenu}>
                        <button className={styles.option} onClick={() => handleOptionClick("edit")}>
                            Изменить
                        </button>
                        <button className={styles.option} onClick={() => console.log("Удалить")}>
                            Удалить
                        </button>
                    </div>
                )}
            </div>

            {modalVisible && (
                <div className={styles.modalOverlay}>
                    <div ref={modalRef} className={styles.modal}>
                        <h2>Редактировать привычку</h2>
                        <label>
                            Заголовок:
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <label>
                            Заметки:
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </label>
                        <label>
                            Категория:
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Выберите категорию</option>
                                <option value="Здоровье">Здоровье</option>
                                <option value="Финансы">Финансы</option>
                                <option value="Развитие">Развитие</option>
                            </select>
                        </label>
                        <label>
                            Выполнить до:
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        </label>
                        {deadline && <p>До {new Date(deadline).toLocaleDateString()}</p>}
                        
                        <div className="modalButtons">
                            <button onClick={handleSave}>Сохранить</button>
                            <button onClick={() => setModalVisible(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Habit;
// import styles from "./Habit.module.scss";
// import threeDotes from '../../images/three_dotes.png'
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import { toggleHabit } from "../../store/habitsSlice"; // Заменить на актуальный импорт

// const Habit = ({ style, habit }) => {
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);

//     const [title, setTitle] = useState(habit.name);
//     const [notes, setNotes] = useState(habit.notes || '');
//     const [category, setCategory] = useState('');
//     const [dueDate, setDueDate] = useState('');

//     const dispatch = useDispatch();
//     const menuRef = useRef(null);
//     const dotsButtonRef = useRef(null);
//     const modalRef = useRef(null);

//     const handleDotsClick = () => {
//         setMenuVisible((prev) => !prev);
//     };

//     const handleOptionClick = (option) => {
//         setMenuVisible(false);
//         if (option === 'edit') {
//             setModalVisible(true);
//         }
//     };

//     const handleClickOutside = useCallback((event) => {
//         if (
//             menuRef.current &&
//             !menuRef.current.contains(event.target) &&
//             dotsButtonRef.current &&
//             !dotsButtonRef.current.contains(event.target)
//         ) {
//             setMenuVisible(false);
//         }
//     }, []);

//     const handleModalClickOutside = useCallback((event) => {
//         if (modalRef.current && !modalRef.current.contains(event.target)) {
//             setModalVisible(false);
//         }
//     }, []);

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         document.addEventListener('mousedown', handleModalClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//             document.removeEventListener('mousedown', handleModalClickOutside);
//         };
//     }, [handleClickOutside, handleModalClickOutside]);

//     return (
//         <>
//             <div className={styles.habit} style={style}>
//                 <label className={styles.checkboxLabel}>
//                     <input
//                         type="checkbox"
//                         checked={habit.completed}
//                         className={styles.checkbox_habit}
//                         onChange={() => dispatch(toggleHabit(habit.id))}
//                     />
//                     <span className={styles.customCheckbox}></span>
//                 </label>
//                 <div className={styles.habit_text}>
//                     <p className={styles.name_habit}>{habit.name}</p>
//                     {habit.notes && <p className={styles.notes_habit}>{habit.notes}</p>}
//                 </div>
//                 <button ref={dotsButtonRef} className={styles.dotsButton} onClick={handleDotsClick}>
//                     <img src={threeDotes} alt="Меню" />
//                 </button>

//                 {menuVisible && (
//                     <div ref={menuRef} className={styles.optionsMenu}>
//                         <button className={styles.option} onClick={() => handleOptionClick('edit')}>
//                             Изменить
//                         </button>
//                         <button className={styles.option} onClick={() => console.log('Удалить')}>
//                             Удалить
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {modalVisible && (
//                 <div className={styles.modalOverlay}>
//                     <div ref={modalRef} className={styles.modal}>
//                         <h2>Редактировать привычку</h2>
//                         <label>
//                             Заголовок:
//                             <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//                         </label>
//                         <label>
//                             Заметки:
//                             <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
//                         </label>
//                         <label>
//                             Категория:
//                             <select value={category} onChange={(e) => setCategory(e.target.value)}>
//                                 <option value="">Выберите категорию</option>
//                                 <option value="Здоровье">Здоровье</option>
//                                 <option value="Финансы">Финансы</option>
//                                 <option value="Развитие">Развитие</option>
//                             </select>
//                         </label>
//                         <label>
//                             Выполнить до:
//                             <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
//                         </label>
//                         {dueDate && <p>До {new Date(dueDate).toLocaleDateString()}</p>}
//                         <button onClick={() => setModalVisible(false)}>Закрыть</button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Habit;
