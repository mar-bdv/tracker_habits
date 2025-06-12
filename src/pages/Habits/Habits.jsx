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
import { fetchCategories } from "../../store/categoriesSlice";
import AddCategoryModal from "../../feautures/AddCategoryModal/AddCategoryModal";
import { getLocalDateString } from "../../utils/date";
import SearchHabits from "../../components/SearchHabits/SearchHabits";
import { motion } from "motion/react"
import arrow_cat from "../../images/arrow_cat.svg"


const Habits = () => {
  const dispatch = useDispatch();
  const userId = useSelector(s => s.auth.user?.id);
  const habits = useSelector(s => s.habits.habits);
  const status = useSelector(s => s.habits.status);
  const error = useSelector(s => s.habits.error);

  const [filter, setFilter] = useState("all"); 
  const [filterCats, setFilterCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [catsOpen, setCatsOpen] = useState(true); 

  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = getLocalDateString(selectedDate);

  const moodsByDate = useSelector((state) => state.moods.moodsByDate);
  const selectedMood = moodsByDate?.[dateStr] || null;

  const { categories } = useSelector((state) => state.categories);
  const userCategoriesCount = categories.filter(cat => !cat.is_system && cat.user_id === userId).length;


  useEffect(() => {
    if (userId) {
      dispatch(fetchHabits(userId));
      dispatch(fetchCategories(userId));
    }
  }, [userId, dispatch]);

  if (status === "loading") return <p>Загрузка...</p>;
  if (status === "failed")  return <p>Ошибка: {error}</p>;


  const activeCount    = habits.filter(h => !h.completedDates?.[new Date().toISOString().slice(0,10)]).length;
  const completedCount = habits.filter(h => !!h.completedDates?.[new Date().toISOString().slice(0,10)]).length;
  const withDateCount  = habits.filter(h => h.deadline && !h.completedDates?.[new Date().toISOString().slice(0,10)]).length;


  const today = new Date().toISOString().slice(0,10);
  
  const filteredByStatus = habits.filter(h => {
    const done = !!h.completedDates?.[today];
    if (filter === "active")    return !done;
    if (filter === "completed") return done;
    if (filter === "withDate")  return h.deadline && !done;
    return true;
  });

  const filteredByCats = filterCats.length === 0
    ? filteredByStatus
    : filteredByStatus.filter(h => filterCats.includes(h.category_id));

  const filteredHabits = filteredByCats.filter(habit =>
    habit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div>
          <div className={styles.container}>
            <div className={styles.header_block}>
              <h2 className={styles.heading}>Ваши привычки</h2>
            </div>

            <div className={styles.habits_block}>
              
              <div className={styles.left_block}>
                <div>
                  <SearchHabits searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>

              <div className={styles.categories_block}>
                <div
                  className={styles.categories_header}
                  onClick={() => setCatsOpen((v) => !v)}
                >
                  <span className={styles.categories_name}>Категории</span>
                  <span
                    className={`${styles.arrow} ${catsOpen ? styles.open : ""}`}
                  >
                    <img src={arrow_cat} alt="Стрелочка" />
                  </span>
                </div>
                <div
                  className={styles.categories_list}
                  style={{
                    display: catsOpen ? "block" : "none"
                  }}
                >
                  <Categories onFilterChange={setFilterCats} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.filter_button}
                    onClick={() => setShowModal(true)}
                  >
                    Добавить свою категорию
                  </motion.button>
                </div>
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
                <div className={styles.habits_list}>

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
          {showModal && 
            <AddCategoryModal 
              onClose={() => setShowModal(false)} userId={userId}
              userCategoriesCount={userCategoriesCount}
            />
          }

        </div>



    </div>
  );
};

export default Habits;