import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./AddCategoryModal.module.scss";
import { addCategory } from "../../store/categoriesSlice";
import { motion } from "motion/react"

const AddCategoryModal = ({ onClose, userId }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleAdd = () => {
        if (!name.trim()) return;

        if (name.trim().length > 20) {
            setError("Название не должно превышать 20 символов");
            return;
        }

        dispatch(addCategory({ name: name.trim(), userId }));
        onClose();
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setName(value);

        if (value.length > 20) {
            setError("Название не должно превышать 20 символов");
        } else {
            setError("");
        }
    };

    return (
        <div className={styles.backdrop}>
            <motion.div 
                className={styles.modal}
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>Добавить категорию</h3>
                </div>

                <div className={styles.input_container}>
                    <p className={styles.title_input}>Название категории</p>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Пишите здесь"
                        value={name}
                        onChange={handleChange}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
                    <button className={styles.addBtn} onClick={handleAdd}>Добавить</button>
                </div>
            </motion.div>
        </div>
    );
};


export default AddCategoryModal;
