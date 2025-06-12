import { useEffect } from "react";
import { useSelector } from "react-redux";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./HowManyPercentDone.module.scss";


const HowManyPercentDone = () => {
    const habits = useSelector((state) => state.habits.habits);
    const selectedDate = new Date();
    const dateStr = selectedDate.toISOString().slice(0, 10);

    const totalHabits = habits.length;
    const completedHabits = habits.filter(
        (habit) => habit.completedDates?.[dateStr]
    ).length;

    const targetPercent = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

    const progress = useMotionValue(0);
    const percentText = useTransform(progress, (val) => `${Math.round(val)}%`);
    const percentWidth = useTransform(progress, (val) => `${val}%`);

    useEffect(() => {
        const controls = animate(progress, targetPercent, {
            duration: 0.3,
            ease: "easeOut",
        });

        return controls.stop;
    }, [targetPercent]);

    return (
        <div className={styles.filters}>
            <p>Сколько % привычек выполнено:</p>

            <div className={styles.progressBar}>
                <motion.div
                    className={styles.progress}
                    style={{ width: percentWidth }}
                />
            </div>

            <motion.p>{percentText}</motion.p>
        </div>
    );
};

export default HowManyPercentDone;