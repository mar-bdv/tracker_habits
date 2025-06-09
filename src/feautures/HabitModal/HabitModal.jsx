import React, { useRef, useEffect, useCallback, useState } from "react";
import styles from "./HabitModal.module.scss"; // Импортируем стили
import { updateHabit, addHabit } from "../../store/habitsSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/categoriesSlice";
import { motion } from "motion/react"

const HabitModal = ({ isVisible, onClose, onSave, title, setTitle, notes, setNotes, category, categories, setCategory, deadline, setDeadline }) => {
    const modalRef = useRef(null);

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
    

    return (
        <div className={styles.modalOverlay}>
            <motion.div 
                ref={modalRef} 
                className={styles.modal}
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
            >
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
                        <textarea 
                            className={styles.modal_textarea} 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            maxLength={150}
                        />
                    </label>
                    <label className={styles.label_text}>
                        Категория:
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.modal_options}
                        >
                            <option value="">Без категории</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.label_text}>
                        Выполнить до:
                        <input 
                            className={styles.modal_input} 
                            type="date" value={deadline} 
                            onChange={(e) => setDeadline(e.target.value)} 
                            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        />
                    </label>
                    <div className={styles.modalButtons}>
                        <button onClick={onClose} className={styles.btn_cancel}>Отмена</button>
                        <button onClick={onSave} className={styles.btn_save}>Сохранить</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HabitModal;



// const HabitModal = ({
//     habit,
//     isVisible,
//     onClose,
//     onSave,
//     title,
//     setTitle,
//     notes,
//     setNotes,
//     category,
//     setCategory,
//     deadline,
//     setDeadline,
// }) => {
//     const modalRef = useRef(null);
//     const dispatch = useDispatch();

//     // берём из стора массив категорий и статус
//     const { categories, status } = useSelector((s) => s.categories);
//     const userId = useSelector((s) => s.auth.user.id);

//     // при монтировании, если нужно — подтягиваем категории
//     useEffect(() => {
//         if (isVisible && userId && status === "idle") {
//         dispatch(fetchCategories(userId));
//         }
//     }, [isVisible, userId, status, dispatch]);

//     // Закрытие кликом вне модалки
//     const handleModalClickOutside = useCallback(
//         (e) => {
//         if (modalRef.current && !modalRef.current.contains(e.target)) {
//             onClose();
//         }
//         },
//         [onClose]
//     );

//     useEffect(() => {
//         if (isVisible) {
//         document.addEventListener("mousedown", handleModalClickOutside);
//         } else {
//         document.removeEventListener("mousedown", handleModalClickOutside);
//         }
//         return () => {
//         document.removeEventListener("mousedown", handleModalClickOutside);
//         };
//     }, [isVisible, handleModalClickOutside]);

//     if (!isVisible) return null;

//     return (
//         <div className={styles.modalOverlay}>
//             <div ref={modalRef} className={styles.modal}>
//                 <h2 className={styles.heading}>Изменить задачу</h2>
//                 <div className={styles.modal_labels}>
//                 <label className={styles.label_text}>
//                     Заголовок:
//                     <input
//                     className={styles.modal_input}
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     />
//                 </label>

//                 <label className={styles.label_text}>
//                     Заметки:
//                     <textarea
//                     className={styles.modal_textarea}
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     />
//                 </label>

//                 <label className={styles.label_text}>
//                     Категория:
//                     <select
//                     className={styles.modal_options}
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     >
//                     <option value="">Без категории</option>
//                     {status === "loading" && <option>Загрузка...</option>}
//                     {status === "succeeded" &&
//                         categories.map((cat) => (
//                         <option key={cat.id} value={cat.name}>
//                             {cat.name}
//                         </option>
//                         ))}
//                     </select>
//                 </label>

//                 <label className={styles.label_text}>
//                     Выполнить до:
//                     <input
//                     className={styles.modal_input}
//                     type="date"
//                     value={deadline}
//                     onChange={(e) => setDeadline(e.target.value)}
//                     />
//                 </label>

//                     <div className={styles.modalButtons}>
//                         <button onClick={onClose} className={styles.btn_cancel}>
//                         Отмена
//                         </button>
//                         <button onClick={onSave} className={styles.btn_save}>
//                             Сохранить
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HabitModal;
