import styles from "./HowManyPercentDone.module.scss";
import percentImg from '../../images/percent.png'
import { useSelector } from "react-redux";

const HowManyPercentDone = () => {
    const habits = useSelector((state) => state.habits.habits);
    const selectedDate = new Date();
    const dateStr = selectedDate.toISOString().slice(0, 10);

    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.completedDates?.[dateStr]).length;

    const percent = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

    return (
        <div className={styles.filters}>
            <p>Сколько % привычек выполнено:</p>

            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>

            <p>{percent}%</p>
        </div>
    );
};

export default HowManyPercentDone;