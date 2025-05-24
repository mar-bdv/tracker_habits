// import styles from "./HowManyPercentDone.module.scss";
// import percentImg from '../../images/percent.png'
// import { useSelector } from "react-redux";

// const HowManyPercentDone = () => {
//     const habits = useSelector((state) => state.habits.habits);
//     const selectedDate = new Date();
//     const dateStr = selectedDate.toISOString().slice(0, 10);

//     const totalHabits = habits.length;
//     const completedHabits = habits.filter(habit => habit.completedDates?.[dateStr]).length;

//     const percent = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

//     return (
//         <div className={styles.filters}>
//             <p>Сколько % привычек выполнено:</p>

//             <div className={styles.progressBar}>
//                 <div
//                     className={styles.progress}
//                     style={{ width: `${percent}%` }}
//                 ></div>
//             </div>

//             <p>{percent}%</p>
//         </div>
//     );
// };

// export default HowManyPercentDone;

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
            duration: 0.3, // можно сделать даже 0.2 или 0.15
            ease: "easeOut",
        });

        return controls.stop; // очищаем, если компонент размонтируется
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

// const HowManyPercentDone = () => {
//     const habits = useSelector((state) => state.habits.habits);
//     const selectedDate = new Date();
//     const dateStr = selectedDate.toISOString().slice(0, 10);

//     const totalHabits = habits.length;
//     const completedHabits = habits.filter(
//         (habit) => habit.completedDates?.[dateStr]
//     ).length;

//     const targetPercent = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

//     // Создаем анимируемое значение
//     const progress = useMotionValue(0);

//     // Добавим плавность с useSpring
//     const springProgress = useSpring(progress, { stiffness: 400, damping: 10 });

//     // Преобразуем в строку с округлением до целого числа
//     const percentText = useTransform(springProgress, (latest) => `${Math.round(latest)}%`);
//     const percentWidth = useTransform(springProgress, (value) => `${value}%`);

//     // Когда меняется цель, обновляем значение
//     useEffect(() => {
//         progress.set(targetPercent);
//     }, [targetPercent]);

//     return (
//         <div className={styles.filters}>
//             <p>Сколько % привычек выполнено:</p>

//             <div className={styles.progressBar}>
//                 <motion.div
//                     className={styles.progress}
//                     style={{ width: percentWidth }}
//                 />
//             </div>

//             <motion.p>{percentText}</motion.p>
//         </div>
//     );
// };

export default HowManyPercentDone;