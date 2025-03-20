import { useState } from "react";
import AddHabitButton from "../../components/AddHabitButton/AddHabitButton";
import Filters from "../../components/Filters/Filters";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import Moods from "../../components/Moods/Moods";
import Habit from "../../components/OneHabit/Habit";
import ShortStatistics from "../../components/ShortStatistics/ShortStatistics";
import Streak from "../../components/Streak/Streak";
import Navigation from "../Navigation/Navigation";
import styles from "./Home.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit } from "../../store/habitsSlice";


const Home = () => {

    // const [habits, setHabits] = useState([]);
    
    //     const addHabit = (name) => {
    //         const newHabit = {
    //             id: Date.now(), // Уникальный ID
    //             name,
    //             notes: "",
    //             category: "",
    //             deadline: "",
    //         };
    //         setHabits([...habits, newHabit]);
    //     };
    
    const habits = useSelector((state) => state.habits);
    const dispatch = useDispatch();
    

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