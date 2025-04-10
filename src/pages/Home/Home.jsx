import { useEffect, useState } from "react";
import AddHabitButton from "../../components/AddHabitButton/AddHabitButton";
import Filters from "../../components/Filters/Filters";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import Moods from "../../components/Moods/Moods";
import Habit from "../../components/Habit/Habit";
import ShortStatistics from "../../components/ShortStatistics/ShortStatistics";
import Streak from "../../components/Streak/Streak";
import Navigation from "../Navigation/Navigation";
import styles from "./Home.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit, fetchHabits } from "../../store/habitsSlice";


const Home = () => {
    const dispatch = useDispatch();

    // Получаем userId из Redux (или если оно в localStorage, то используем его)
    const userId = useSelector((state) => state.auth.user?.id);
    const habits = useSelector((state) => state.habits.habits);
    const status = useSelector((state) => state.habits.status);
    const error = useSelector((state) => state.habits.error);
    useEffect(() => {
        if (userId) {
            dispatch(fetchHabits(userId));
        }
    }, [userId, dispatch]);

    return (
        <div className={styles.home_container}>
            <div className={styles.hello_block}>
                <p className={styles.heading}>привет, <span className={styles.heading_span}>name</span>!</p>
                <p className={styles.hello_descr}>твой прогресс на сегодня:</p>
            </div>

            <div className={styles.two_blocks}>

                <div className={styles.habits_block}>
                    <div className={styles.habits_filter}>
                        <p className={styles.habits_text}>Твои привычки на сегодня:</p>
                        <Filters/>
                    </div>

                    {/* КОНТЕЙНЕР */}
                    <div className={styles.habits_list}>
                        {/* ПРИВЫЧКИ */}
                        <div className={styles.habits}>

                            {habits.map((habit) => (
                                <Habit key={habit.id} habit={habit} />
                            ))}

                        </div>

                        <AddHabitButton onAdd={(name) => dispatch(addHabit(name))} />
                    </div>
                </div>

                <div className={styles.statistics_container}>
                    <ShortStatistics/>
                    <div className={styles.streak_container}>
                        <HowManyPercentDone/>
                        <Streak/>
                    </div>

                    <div>
                        <p>Какое у вас сегодня настроение?</p>
                        <Moods />
                    </div>


                </div>
            </div>
        </div>

    )
}

export default Home;