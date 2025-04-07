import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toggleHabit, updateHabit } from "../../store/habitsSlice"
import styles from "./Habit.module.scss";
import threeDotes from '../../images/three_dotes.png'
import HabitModal from "../../feautures/HabitModal/HabitModal";

const Habit = ({ style, habit }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [title, setTitle] = useState(habit.title);
    const [notes, setNotes] = useState(habit.notes || "");
    const [category, setCategory] = useState(habit.category || "");
    const [deadline, setDeadline] = useState(habit.deadline || "");

    console.log(habit.title, habit.notes, habit.category)

    

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
        // dispatch(updateHabit({ id: habit.id, updatedData: { name: title, notes, category, deadline } }));
        setModalVisible(false); // Закрываем модалку после сохранения
    };

    const userId = useSelector((state) => state.user?.id); 
    

    return (
        <>
            <div className={styles.habit} style={style}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={habit.completed}
                        className={styles.checkbox_habit}
                        // onChange={() => dispatch(toggleHabit({ userId, habitId: habit.id, completed: !habit.completed }))}
                    />
                    <span className={styles.customCheckbox}></span>
                </label>
                <div className={styles.habit_text}>
                    <p className={styles.name_habit}>{habit.title}</p>
                    {habit.notes && <p className={styles.notes_habit}>{habit.notes}</p>}
                    <div className={styles.habit_category_container}>
                        {habit.deadline && <p className={styles.deadline_habit}>До {new Date(habit.deadline).toLocaleDateString()}</p>}
                        {habit.category && <p className={styles.category_habit}>{habit.category}</p>}
                    </div>

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

            {/* Используем новый компонент для модального окна */}
            <HabitModal
                habit={habit}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
                title={title}
                setTitle={setTitle}
                notes={notes}
                setNotes={setNotes}
                category={category}
                setCategory={setCategory}
                deadline={deadline}
                setDeadline={setDeadline}
            />
        </>

    );
};

export default Habit;
