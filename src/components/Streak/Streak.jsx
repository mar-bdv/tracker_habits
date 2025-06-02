import { useDispatch, useSelector } from "react-redux";
import styles from "./Streak.module.scss";
import { useEffect } from "react";
import { fetchUserStreak, updateUserStreak } from "../../store/streakSlice";

const Streak = () => {
    const dispatch = useDispatch();
    const userId = useSelector(s => s.auth.user?.id);
    const { count, status, error } = useSelector(s => s.streak);

    useEffect(() => {
        if (userId) dispatch(fetchUserStreak(userId));
    }, [dispatch, userId]);

    if (status === "loading") return <p>Загрузка серии…</p>;
    if (status === "failed")  return <p>Ошибка: {error}</p>;

    if (count === 0) {
        return (
        <div>
            <h2 className={styles.no_streak}>
                Пока нет выполненных дней подряд.
            </h2>
            <p className={styles.no_streak}>Начни отмечать привычки, чтобы запустить серию!</p>
        </div>
        );
    }

    return (
        <div className={styles.streak_container}>
            <h2 className={styles.streak}>
                Твоя серия: {count} {count === 1 ? "день" : "дня"} подряд
            </h2>
        </div>
    );
};



export default Streak;