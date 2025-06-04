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
import { addHabit, fetchHabitCompletions, fetchHabits } from "../../store/habitsSlice";
import { getLocalDateString } from "../../utils/date";
import { fetchCategories } from "../../store/categoriesSlice";
import { fetchTodayMood } from "../../store/moodsSlice";
import { AnimatePresence, motion } from "motion/react"

const Home = () => {
    const dispatch = useDispatch();

    const [filter, setFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const userId = useSelector((state) => state.auth.user?.id);
    const user = useSelector((state) => state.auth.user);
    const habits = useSelector((state) => state.habits.habits);

    const dateStr = getLocalDateString(selectedDate);

    const moodsByDate = useSelector((state) => state.moods.moodsByDate);
    const selectedMood = moodsByDate?.[dateStr] || null;

    useEffect(() => {
        if (userId) {
            dispatch(fetchHabits(userId));
            dispatch(fetchCategories(userId));
            dispatch(fetchTodayMood(userId));
        }
    }, [userId, selectedDate, dispatch]);


    useEffect(() => {
        dispatch(fetchHabits(userId))
        dispatch(fetchCategories(userId));
    }, [userId, habits.length, dispatch]);


    const filteredHabits = habits.filter(habit => {
        const done = !!habit.completedDates?.[dateStr];
        switch (filter) {
            case "active":    
                return !done;
            case "completed": 
                return done;
            case "withDate":  
                return habit.deadline && !done;
            case "byDate":    
                return habit.deadline?.slice(0,10) === dateStr;
            default:          
                return true;
        }
    });

    const activeCount = habits.filter(h => !h.completedDates?.[dateStr]).length;
    const completedCount = habits.filter(h =>  h.completedDates?.[dateStr]).length;
    const withDateCount = habits.filter(h => h.deadline && !h.completedDates?.[dateStr]).length;

    return (
        <div className={styles.home_container}>
            <motion.div 
                className={styles.hello_block}
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
            >
                <p className={styles.heading}>привет, 
                    <span className={styles.heading_span}>{user?.nickname || 'Пользователь'}</span>!
                </p>
                <p className={styles.hello_descr}>твой прогресс на сегодня:</p>
            </motion.div>

            <div className={styles.two_blocks}>

                <div className={styles.habits_block}>
                    <div className={styles.habits_filter}>
                        <p className={styles.habits_text}>Твои привычки на сегодня:</p>
                        <Filters
                            activeCount={activeCount}
                            completedCount={completedCount}
                            withDateCount={withDateCount}
                            setFilter={setFilter}
                            currentFilter={filter}
                        />
                    </div>

                    <div className={styles.habits_list}>
                        <motion.div layout className={styles.habits}>
                            {/* <AnimatePresence mode="sync">
                                {filteredHabits.map(habit => (
                                    <Habit
                                        key={habit.id}
                                        habit={habit}
                                        selectedDate={dateStr}
                                    />
                                ))}
                            </AnimatePresence> */}
                            <AnimatePresence mode="sync">
                                {habits.length === 0 ? (
                                    <motion.p
                                        className={styles.no_habits_message}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        Добавьте свою первую привычку!
                                    </motion.p>
                                ) : (
                                    filteredHabits.map(habit => (
                                        <Habit
                                            key={habit.id}
                                            habit={habit}
                                            selectedDate={dateStr}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>

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
                        <Moods 
                            selectedMood={selectedMood} 
                            selectedDate={selectedDate} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;