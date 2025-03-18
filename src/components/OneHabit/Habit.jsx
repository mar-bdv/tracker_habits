import styles from "./Habit.module.scss";
import threeDotes from '../../images/three_dotes.png'

const Habit = ({ style }) => {

    return (
        <div className={styles.habit} style={style}>
            <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox_habit} />
                <span className={styles.customCheckbox}></span>
            </label>
            <div className={styles.habit_text}>
                <p className={styles.name_habit}>Пилатес</p>
                <p className={styles.notes_habit}>Заметки</p>
            </div>
            <button className={styles.dotsButton}>
                <img src={threeDotes} alt="" />

            </button>
        </div>
    )
}

export default Habit;