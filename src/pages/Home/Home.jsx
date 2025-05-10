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


const Home = () => {
    const dispatch = useDispatch();

    // Получаем userId из Redux (или если оно в localStorage, то используем его)
    const userId = useSelector((state) => state.auth.user?.id);
    const habits = useSelector((state) => state.habits.habits);
    const status = useSelector((state) => state.habits.status);
    const error = useSelector((state) => state.habits.error);
    const [filter, setFilter] = useState("all"); // all | active | completed | withDate
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const completions = useSelector((state) => state.habits.completions);


    useEffect(() => {
        if (userId) {
            dispatch(fetchHabits(userId));
            dispatch(fetchCategories(userId));
            // dispatch(fetchHabitCompletions({ userId, date: dateStr }));
        }
    }, [userId, selectedDate, dispatch]);

    const dateStr = getLocalDateString(selectedDate); // формат "2025-05-08"


    const filteredHabits = habits.filter(habit => {
        const done = !!habit.completedDates?.[dateStr];
        switch (filter) {
            case "active":    return !done;
            case "completed": return done;
            case "withDate":  return habit.deadline && !done;
            case "byDate":    return habit.deadline?.slice(0,10) === dateStr;
            default:          return true;
        }
    });



    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchHabits(userId))
        dispatch(fetchCategories(userId));
    }, [userId, habits.length, dispatch]);

    const activeCount    = habits.filter(h => !h.completedDates?.[dateStr]).length;
    const completedCount = habits.filter(h =>  h.completedDates?.[dateStr]).length;
    const withDateCount  = habits.filter(h => h.deadline && !h.completedDates?.[dateStr]).length;

    return (
        <div className={styles.home_container}>
            <div className={styles.hello_block}>
                <p className={styles.heading}>привет, <span className={styles.heading_span}>{user?.nickname || 'Пользователь'}</span>!</p>
                <p className={styles.hello_descr}>твой прогресс на сегодня:</p>
            </div>

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

                    {/* КОНТЕЙНЕР */}
                    <div className={styles.habits_list}>
                        {/* ПРИВЫЧКИ */}
                        <div className={styles.habits}>

                            {/* {habits.map((habit) => (
                                <Habit key={habit.id} habit={habit} selectedDate={getLocalDateString(selectedDate)}/>
                            ))} */}

                            {filteredHabits.map(habit => (
                                <Habit
                                    key={habit.id}
                                    habit={habit}
                                    selectedDate={dateStr}
                                />
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