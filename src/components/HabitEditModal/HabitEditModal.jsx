import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleHabit } from '../redux/actions'; // Заменить на актуальный импорт
import styles from './Habit.module.scss';

const EditHabitModal = ({ habit, onClose, onSave }) => {
    const [title, setTitle] = useState(habit.name);
    const [notes, setNotes] = useState(habit.notes || '');
    const [category, setCategory] = useState(''); // Заглушка
    const [deadline, setDeadline] = useState('');
    
    const handleSave = () => {
        onSave({ ...habit, name: title, notes, category, deadline });
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
                        <option value="Работа">Работа</option>
                    </select>
                </label>
                <label>
                    Выполнить до:
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </label>
                {deadline && <p className={styles.deadlineText}>до {new Date(deadline).toLocaleDateString()}</p>}
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </div>
    );
};