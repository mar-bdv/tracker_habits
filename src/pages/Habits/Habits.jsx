import { useState } from "react";
import AddHabitButton from "../../components/AddHabitButton/AddHabitButton";
import Categories from "../../components/Categories/Categories";
import Filters from "../../components/Filters/Filters";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import Moods from "../../components/Moods/Moods";
import Habit from "../../components/OneHabit/Habit";
import Navigation from "../Navigation/Navigation";
import styles from "./Habits.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit } from "../../store/habitsSlice";

const Habits = () => {
    // const [habits, setHabits] = useState([]);

    // const addHabit = (name) => {
    //     const newHabit = {
    //         id: Date.now(), // Уникальный ID
    //         name,
    //         notes: "",
    //         category: "",
    //         deadline: "",
    //     };
    //     setHabits([...habits, newHabit]);
    // };

    // console.log("addHabit in Habits:", addHabit);
    const habits = useSelector((state) => state.habits);
    const dispatch = useDispatch();



    return (
        <div className={styles.container}>
            <div className={styles.header_block}>
                <h2 className={styles.heading}>Ваши привычки</h2>
            </div>

            <div className={styles.habits_block}>
                <div className={styles.left_block}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Поиск привычек"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.categories_block}>
                        <p>Категории</p>
                        <Categories />

                        <button className={styles.filter_button}>добавить свою категорию</button>
                    </div>
                </div>

                <div className={styles.right_block}>
                    <div>
                        <Filters />
                    </div>

                    <div className={styles.addhabit_container}>
                        <div className={styles.habits}>
                            {habits.map((habit) => (
                                <Habit key={habit.id} habit={habit} />
                            ))}
                        </div>
                        
                        <AddHabitButton onAdd={(name) => dispatch(addHabit(name))} />
                    </div>

                    <div className={styles.moods_container}>
                        <HowManyPercentDone />
                        
                        <p>Какое у вас сегодня настроение?</p>
                        <Moods />
                    </div>
                    
                </div>

                
                
            </div>
        </div>
    )
}

export default Habits;