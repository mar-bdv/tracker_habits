import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toggleHabit, updateHabit } from "../../store/habitsSlice"
import styles from "./Habit.module.scss";
import threeDotes from '../../images/three_dotes.png'
import HabitModal from "../../feautures/HabitModal/HabitModal";
import { addHabit } from "../../habitsThunks";
import { deleteHabit, toggleHabit, toggleHabitForDate, updateHabit, updateHabitImmediate } from "../../store/habitsSlice";
import { getLocalDateString } from "../../utils/date";
import { fetchCategories } from "../../store/categoriesSlice";

const Habit = ({ style, habit, selectedDate }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(habit.title);
    const [notes, setNotes] = useState(habit.notes || "");
    const [category, setCategory] = useState(habit.category || "");
    const [deadline, setDeadline] = useState(habit.deadline || "");
  
    const dispatch = useDispatch();
    const { id: userId } = useSelector((state) => state.auth.user) || {};
    const { categories, status } = useSelector((state) => state.categories);

    useEffect(() => {
      if (userId && status === "idle") {
        dispatch(fetchCategories(userId));
      }
    }, [dispatch, userId, status]);

  
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
  
    const handleDelete = () => {
      if (window.confirm("Точно удалить привычку?")) {
        dispatch(deleteHabit(habit.id));
        setMenuVisible(false);
      }
    };
  
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
  
    const handleSave = () => {
      const updatedHabitData = {
        id: habit.id,
        title: title || "",
        notes: notes || "",
        category: category || "",
        deadline: deadline || null,
        user_id: userId,
      };

      dispatch(updateHabit(updatedHabitData))
        .then((action) => {
          if (updateHabit.fulfilled.match(action) && action.payload) {
            // теперь payload — это сразу объект обновлённой привычки
            dispatch(updateHabitImmediate(action.payload));
          }
        })
        .catch((err) => {
          console.error("Не удалось обновить привычку:", err);
        });
  
      setModalVisible(false);
    };
  
    const currentDate = selectedDate || getLocalDateString();  
  


    return (
      <>
        <div className={styles.habit} style={style}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={habit.completedDates?.[currentDate] || false} 
              className={styles.checkbox_habit}
              onChange={() => {
                dispatch(
                  toggleHabitForDate({
                    userId,
                    habitId: habit.id,
                    date: currentDate,
                  })
                );
              }}
            />
            <span className={styles.customCheckbox}></span>
          </label>
          <div className={styles.habit_text}>
            <p className={styles.name_habit}>{habit.title}</p>
            {habit.notes && <p className={styles.notes_habit}>{habit.notes}</p>}
            <div className={styles.habit_category_container}>
              {habit.deadline && (
                <p className={styles.deadline_habit}>
                  До {new Date(habit.deadline).toLocaleDateString()}
                </p>
              )}
              {habit.category && <p className={styles.category_habit}>{habit.category}</p>}
            </div>
          </div>
          <button ref={dotsButtonRef} className={styles.dotsButton} onClick={handleDotsClick}>
            <img src={threeDotes} alt="Меню" />
          </button>
  
          {menuVisible && (
            <div ref={menuRef} className={styles.optionsMenu}>
              <button className={styles.option} onClick={() => handleOptionClick("edit")}>Изменить</button>
              <button className={styles.option} onClick={handleDelete}>Удалить</button>
            </div>
          )}
        </div>
  
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
          categories={categories}
          setCategory={setCategory}
          deadline={deadline}
          setDeadline={setDeadline}
        />
      </>
    );
  };
  
export default Habit;
  