import { useEffect, useState } from "react";
import AddHabitButton from "../../components/AddHabitButton/AddHabitButton";
import Categories from "../../components/Categories/Categories";
import Filters from "../../components/Filters/Filters";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import Moods from "../../components/Moods/Moods";
import Habit from "../../components/Habit/Habit";
import Navigation from "../Navigation/Navigation";
import styles from "./Habits.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addHabit, fetchHabits } from "../../store/habitsSlice";
import { getUserHabits } from "../../habitsThunks";

// const Habits = () => {
    
//     const dispatch = useDispatch();
//     const userId = useSelector((state) => state.user?.id); // Берём ID текущего пользователя

//     const loading = useSelector((state) => state.habits.loading);
//     useEffect(() => {
//         if (userId) {
//             dispatch(getUserHabits(userId));
//         }
//     }, [dispatch, userId]);

//     const habits = useSelector((state) => state.habits.habits);
//     const status = useSelector((state) => state.habits.status);
//     const error = useSelector((state) => state.habits.error);

//     useEffect(() => {
//         if (userId) {
//             dispatch(fetchHabits(userId)); // Загружаем привычки при монтировании
//         }
//         console.log("userId from Redux:", userId); 
//         console.log("habitsHabits", habits)

//     }, [dispatch, userId]);

//     return (
//         <div className={styles.container}>
//             <div className={styles.header_block}>
//                 <h2 className={styles.heading}>Ваши привычки</h2>
//             </div>

//             <div className={styles.habits_block}>
//                 <div className={styles.left_block}>
//                     <div>
//                         <input 
//                             type="text" 
//                             placeholder="Поиск привычек"
//                             className={styles.input}
//                         />
//                     </div>

//                     <div className={styles.categories_block}>
//                         <p>Категории</p>
//                         <Categories />

//                         <button className={styles.filter_button}>добавить свою категорию</button>
//                     </div>
//                 </div>

//                 <div className={styles.right_block}>
//                     <div>
//                         <Filters />
//                     </div>

//                     <div className={styles.addhabit_container}>
//                         <div className={styles.habits}>
//                         {habits.length > 0 ? (
//                             habits.map((habit) => { 
//                                 console.log("HABIT", habit) })
//                         ) : (
//                             <p>У вас пока нет привычек.</p>
//                         )}
//                         </div>
                        
//                         <AddHabitButton userId={userId} />
//                     </div>

//                     <div className={styles.moods_container}>
//                         <HowManyPercentDone />
                        
//                         <p>Какое у вас сегодня настроение?</p>
//                         <Moods />
//                     </div>
                    
//                 </div>

                
                
//             </div>
//         </div>
//     )
// }



const Habits = () => {
    const dispatch = useDispatch();
  
    // Получаем userId из Redux (или если оно в localStorage, то используем его)
    const userId = useSelector((state) => state.auth.user?.id);
    const habits = useSelector((state) => state.habits.habits);
    const status = useSelector((state) => state.habits.status);
    const error = useSelector((state) => state.habits.error);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
      if (userId && habits.length === 0) {
        dispatch(fetchHabits(userId));
      }
    }, [userId, habits.length, dispatch]);
  
    if (status === 'loading') {
      return <p>Загрузка...</p>;
    }
  
    if (status === 'failed') {
      return <p>Ошибка загрузки привычек: {error}</p>;
    }
  
    return (
      // <div>
      //   <h2>Мои привычки</h2>
      //   <div>
      //     {habits.map((habit) => (
      //       <Habit key={habit.id} habit={habit} />
      //     ))}
      //   </div>

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
            </div>
          

          <div className={styles.categories_block}>
            <p>Категории</p>
            <Categories />
            <button className={styles.filter_button}>добавить свою категорию</button>
          </div>

            <div className={styles.right_block}>
              <div>
                <Filters />
              </div>
            


              <div className={styles.addhabit_container}>
                <div className={styles.habits}>

                  {habits.length > 0 ? (
                    habits.map((habit) => (
                      <Habit key={habit.id} habit={habit} />
                    ))
                  ) : (
                    <p>У вас пока нет привычек.</p>
                  )}

                </div>
                <AddHabitButton userId={userId} />
              </div>

              <div className={styles.moods_container}>
                <HowManyPercentDone />
                <p>Какое у вас сегодня настроение?</p>
                <Moods />
              </div>

            </div>
          </div>
        </div>



    );
  };


export default Habits;