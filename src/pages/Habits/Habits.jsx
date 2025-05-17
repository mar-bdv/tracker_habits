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
import { fetchCategories } from "../../store/categoriesSlice";
import AddCategoryModal from "../../feautures/AddCategoryModal/AddCategoryModal";
import { getLocalDateString } from "../../utils/date";



const Habits = () => {
  const dispatch = useDispatch();
  const userId = useSelector(s => s.auth.user?.id);
  const habits = useSelector(s => s.habits.habits);
  const status = useSelector(s => s.habits.status);
  const error = useSelector(s => s.habits.error);

  const [filter, setFilter] = useState("all"); 
  const [filterCats, setFilterCats] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = getLocalDateString(selectedDate); // формат "2025-05-08"

  const moodsByDate = useSelector((state) => state.moods.moodsByDate);
  const selectedMood = moodsByDate?.[dateStr] || null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchHabits(userId));
      dispatch(fetchCategories(userId));
    }
  }, [userId, dispatch]);

  if (status === "loading") return <p>Загрузка...</p>;
  if (status === "failed")  return <p>Ошибка: {error}</p>;

  // Подсчёты
  const activeCount    = habits.filter(h => !h.completedDates?.[new Date().toISOString().slice(0,10)]).length;
  const completedCount = habits.filter(h => !!h.completedDates?.[new Date().toISOString().slice(0,10)]).length;
  const withDateCount  = habits.filter(h => h.deadline && !h.completedDates?.[new Date().toISOString().slice(0,10)]).length;

  // Фильтрация
  const today = new Date().toISOString().slice(0,10);
  const filteredByStatus = habits.filter(h => {
    const done = !!h.completedDates?.[today];
    if (filter === "active")    return !done;
    if (filter === "completed") return done;
    if (filter === "withDate")  return h.deadline && !done;
    return true;
  });

  // Фильтрация по категориям (если нужны оба сразу, можно комбинировать)
  const filteredHabits = filterCats.length === 0
    ? filteredByStatus
    : filteredByStatus.filter(h => filterCats.includes(h.category_id));

  return (
    <div>
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
                <Categories onFilterChange={setFilterCats} />                
                {/* <button className={styles.filter_button}>Добавить свою категорию</button> */}
                  <button
                  className={styles.filter_button}
                  onClick={() => setShowModal(true)}
                  >
                    Добавить свою категорию
                  </button>
              </div>
            </div>

            <div className={styles.right_block}>
              <div>
                <Filters
                  activeCount={activeCount}
                  completedCount={completedCount}
                  withDateCount={withDateCount}
                  setFilter={setFilter}
                  currentFilter={filter}
                />
              </div>
            


              <div className={styles.addhabit_container}>
                <div className={styles.habits}>

                <div className={styles.habits}>
                  {filteredHabits.length > 0 ? (
                    filteredHabits.map((habit) => (
                      <Habit key={habit.id} habit={habit} />
                    ))
                  ) : (
                    <p>Нет привычек для выбранных категорий.</p>
                  )}
                </div>

                </div>
                <AddHabitButton userId={userId} />
              </div>

              <div className={styles.moods_container}>
                <HowManyPercentDone />
                <p>Какое у вас сегодня настроение?</p>
                <Moods 
                  selectedMood={selectedMood} 
                  selectedDate={selectedDate} 
                />
              </div>

            </div>
          </div>
          {showModal && <AddCategoryModal onClose={() => setShowModal(false)} userId={userId} />}

        </div>



    </div>
  );
};

export default Habits;

// const Habits = () => {
//     const dispatch = useDispatch();
  
//     // Получаем userId из Redux (или если оно в localStorage, то используем его)
//     const userId = useSelector((state) => state.auth.user?.id);
//     const habits = useSelector((state) => state.habits.habits);
//     const status = useSelector((state) => state.habits.status);
//     const error = useSelector((state) => state.habits.error);
//     const authStatus = useSelector((state) => state.auth.status);
//     const [filterCats, setFilterCats] = useState([]);
//     const [showModal, setShowModal] = useState(false);

//     const filteredHabits =
//       filterCats.length === 0
//       ? habits
//       : habits.filter((habit) => filterCats.includes(habit.category_id));


//     useEffect(() => {
//       dispatch(fetchHabits(userId))
//       dispatch(fetchCategories(userId));
//     }, [userId, habits.length, dispatch]);
  
//     if (status === 'loading') {
//       return <p>Загрузка...</p>;
//     }
  
//     if (status === 'failed') {
//       return <p>Ошибка загрузки привычек: {error}</p>;
//     }
  
//     return (

//         <div className={styles.container}>
//           <div className={styles.header_block}>
//             <h2 className={styles.heading}>Ваши привычки</h2>
//           </div>

//           <div className={styles.habits_block}>
            
//             <div className={styles.left_block}>
//               <div>
//                 <input 
//                   type="text" 
//                   placeholder="Поиск привычек"
//                   className={styles.input}
//                 />
//               </div>

//               <div className={styles.categories_block}>
//                 <p>Категории</p>
//                 <Categories onFilterChange={setFilterCats} />                
//                 {/* <button className={styles.filter_button}>Добавить свою категорию</button> */}
//                   <button
//                   className={styles.filter_button}
//                   onClick={() => setShowModal(true)}
//                   >
//                     Добавить свою категорию
//                   </button>
//               </div>
//             </div>

//             <div className={styles.right_block}>
//               <div>
//                 <Filters />
//               </div>
            


//               <div className={styles.addhabit_container}>
//                 <div className={styles.habits}>

//                 <div className={styles.habits}>
//                   {filteredHabits.length > 0 ? (
//                     filteredHabits.map((habit) => (
//                       <Habit key={habit.id} habit={habit} />
//                     ))
//                   ) : (
//                     <p>Нет привычек для выбранных категорий.</p>
//                   )}
//                 </div>

//                 </div>
//                 <AddHabitButton userId={userId} />
//               </div>

//               <div className={styles.moods_container}>
//                 <HowManyPercentDone />
//                 <p>Какое у вас сегодня настроение?</p>
//                 <Moods />
//               </div>

//             </div>
//           </div>
//           {showModal && <AddCategoryModal onClose={() => setShowModal(false)} userId={userId} />}

//         </div>




//     );
//   };


// export default Habits;