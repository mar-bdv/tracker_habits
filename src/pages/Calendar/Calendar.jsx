import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import styles from "./Calendar.module.scss";
import leftArrow from "../../images/left_arrow_month.png"
import rightArrow from "../../images/right_arrow_month.png"
import Filters from "../../components/Filters/Filters";
import Habit from "../../components/Habit/Habit";
import Moods from "../../components/Moods/Moods";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../../store/habitsSlice";
import { getLocalDateString } from "../../utils/date";
import { fetchCategories } from "../../store/categoriesSlice";
import { moodIcons } from '../../components/Moods/Moods'
import { fetchMoodsByMonth } from "../../store/moodsSlice";

export const Calendar = () => {
    const dispatch = useDispatch();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState("all");

    const moodsByDate = useSelector((state) => state.moods.moodsByDate);
    const userId = useSelector((state) => state.auth.user?.id);
    const habits = useSelector((state) => state.habits.habits);
    const status = useSelector((state) => state.habits.status);
    const error = useSelector((state) => state.habits.error);
    const authStatus = useSelector((state) => state.auth.status);

    const dateStr = selectedDate ? getLocalDateString(selectedDate) : "";
    const selectedMood = moodsByDate?.[dateStr] || null;

    const fullWeekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    const shortWeekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 420);
    
    useLayoutEffect(() => {
        setIsMobile(window.innerWidth <= 420);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 420);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const currentMonth = currentDate.getMonth(); // Месяц (0-11)
    const currentYear = currentDate.getFullYear(); // Год


    const handleDayClick = (day) => {
        if (!day) return;
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    
    useEffect(() => {
        if (userId && habits.length === 0) {
            dispatch(fetchCategories(userId));
            dispatch(fetchHabits(userId));
        }
    }, [userId, habits.length, dispatch]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchMoodsByMonth({ userId, year: currentYear, month: currentMonth }));
        }
    }, [userId, currentYear, currentMonth, dispatch]);

    
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();

        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const getMonthName = (month) => {
        const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        return months[month];
    };

    // Функция для изменения месяца
    // const changeMonth = (direction) => {
    //     const newDate = new Date(currentDate);
    //     newDate.setMonth(currentDate.getMonth() + direction);

    //     // Ограничиваем переход месяцами в диапазоне от 3 месяцев назад до 3 месяцев вперед
    //     if (newDate.getMonth() < currentDate.getMonth() - 3 || newDate.getMonth() > currentDate.getMonth() + 3) {
    //     return;
    //     }

    //     setCurrentDate(newDate);
    // };
    

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);

        // Ограничиваем переход месяцами в диапазоне от 3 месяцев назад до 3 месяцев вперед
        if (newDate.getMonth() < currentDate.getMonth() - 3 || newDate.getMonth() > currentDate.getMonth() + 3) {
            return;
        }

        setCurrentDate(newDate);

        const today = new Date();
        // Если месяц и год совпадают с текущими — выделяем сегодняшнюю дату
        if (
            newDate.getMonth() === today.getMonth() &&
            newDate.getFullYear() === today.getFullYear()
        ) {
            setSelectedDate(today);
        } else {
            setSelectedDate(null); // сбрасываем выделение
        }
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);

    const calendarDays = [...emptyCells, ...daysArray];


    const activeCount    = habits.filter(h => !h.completedDates?.[dateStr]).length;
    const completedCount = habits.filter(h =>  h.completedDates?.[dateStr]).length;
    const withDateCount  = habits.filter(h => h.deadline && !h.completedDates?.[dateStr]).length;

    // const filteredByStatus = habits.filter(habit => {
    //     const done = !!habit.completedDates?.[dateStr];
    //     if (filter === "active")    return !done;
    //     if (filter === "completed") return done;
    //     if (filter === "withDate")  return habit.deadline && !done;
    //     return true;
    // });

    
    // const filteredByStatus = habits.filter(habit => {
    //     const done = !!habit.completedDates?.[dateStr];
    //     const createdAt = new Date(habit.created_at).setHours(0,0,0,0);
    //     const deadline = habit.deadline ? new Date(habit.deadline).setHours(0,0,0,0) : Infinity;
    //     const sel = selectedDate ? new Date(selectedDate).setHours(0,0,0,0) : null;

    //     if (filter === "active")    return !done;
    //     if (filter === "completed") return done;
    //     if (filter === "withDate")  
    //         return habit.deadline && !done && sel >= createdAt && sel <= deadline;
    //     return true;
    // });

    // const filteredByCalendar = filteredByStatus.filter(habit => {
    //     const sel = new Date(selectedDate).setHours(0,0,0,0);
    //     const start = new Date(habit.created_at).setHours(0,0,0,0);
    //     const end = habit.deadline 
    //         ? new Date(habit.deadline).setHours(0,0,0,0) 
    //         : Infinity;
    //     return sel >= start && sel <= end;
    // });

    // const habitsForSelectedDate = habits.filter(habit => {
    //     const sel = selectedDate ? new Date(selectedDate).setHours(0,0,0,0) : null;
    //     const createdAt = new Date(habit.created_at).setHours(0,0,0,0);
    //     // Если нет дедлайна — привычка бессрочная, показываем всегда
    //     if (!habit.deadline) return sel >= createdAt;
    //     const deadline = new Date(habit.deadline).setHours(0,0,0,0);
    //     return sel >= createdAt && sel <= deadline;
    // });

    // const filteredHabits = habitsForSelectedDate.filter(habit => {
    //     const done = !!habit.completedDates?.[dateStr];
    //     if (filter === "active")    return !done;
    //     if (filter === "completed") return done;
    //     if (filter === "withDate")  return !!habit.deadline && !done;
    //     return true;
    // });

    const habitsForSelectedDate = habits.filter(habit => {
        const sel = selectedDate ? new Date(selectedDate).setHours(0,0,0,0) : null;
        const createdAt = new Date(habit.created_at).setHours(0,0,0,0);
        // Если нет дедлайна — привычка бессрочная, показываем всегда
        if (!habit.deadline) return sel >= createdAt;
        const deadline = new Date(habit.deadline).setHours(0,0,0,0);
        return sel >= createdAt && sel <= deadline;
    });

    const filteredHabits = habitsForSelectedDate.filter(habit => {
        const done = !!habit.completedDates?.[dateStr];
        if (filter === "active")    return !done;
        if (filter === "completed") return done;
        if (filter === "withDate")  return !!habit.deadline && !done;
        return true;
    });


    const habitCountsByDate = useMemo(() => {
        const counts = {};
        if (!habits || habits.length === 0) return counts;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = getLocalDateString(date);

            const count = habits.filter(habit => {
                const createdAt = new Date(habit.created_at).setHours(0,0,0,0);
                const deadline = habit.deadline ? new Date(habit.deadline).setHours(0,0,0,0) : Infinity;
                const current = date.setHours(0,0,0,0);

                return current >= createdAt && current <= deadline;
            }).length;

            counts[dateStr] = count;
        }

        return counts;
    }, [habits, currentMonth, currentYear, daysInMonth]);

    const activeHabitsForDate = habits.filter(habit => {
        const sel = new Date(selectedDate).setHours(0, 0, 0, 0);
        const start = new Date(habit.created_at).setHours(0, 0, 0, 0);
        const end = habit.deadline 
            ? new Date(habit.deadline).setHours(0, 0, 0, 0)
            : Infinity;

        return sel >= start && sel <= end;
    });


    return (
        <div className={styles.container}>
            <div className={styles.heading_block}>
                <h2 className={styles.heading}>Календарь</h2>
            </div>

            <div className={styles.container_calendar}>
                <div className={styles.calendar_block}>
                    <div className={styles.navigation}>
                        <button
                            className={styles.arrow}
                            onClick={() => changeMonth(-1)}
                            disabled={currentDate.getMonth() <= new Date().getMonth() - 3}
                        >
                            <img className={styles.arrow_img} src={leftArrow} alt="стрелка влево" />
                        </button>

                        <div className={styles.monthName}>{getMonthName(currentMonth)} {currentYear}</div>

                        <button
                            className={styles.arrow}
                            onClick={() => changeMonth(1)}
                            disabled={currentDate.getMonth() >= new Date().getMonth() + 3}
                        >
                            <img className={styles.arrow_img} src={rightArrow} alt="стрелка вправо" />

                        </button>
                    </div>

                    <div className={styles.calendar}>
                        {/* Дни недели */}
                        <div className={styles.weekdays}>
                            {(isMobile ? shortWeekdays : fullWeekdays).map((day, index) => (
                                <div 
                                    key={index}
                                    data-full={fullWeekdays[index]}
                                    data-short={shortWeekdays[index]}
                                >
                                    {/* {day} */}
                                </div>
                            ))}
                        </div>

                        {/* Дни месяца */}
                        <div className={styles.days}>
                            {calendarDays.map((day, index) => {
                                // Проверяем, выбран ли этот день
                                let isSelected = false;
                                if (selectedDate && day) {
                                    isSelected =
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === currentMonth &&
                                        selectedDate.getFullYear() === currentYear;
                                }
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.day} ${isSelected ? styles.selected : ""}`}
                                        onClick={() => handleDayClick(day)}
                                    >
                                        <p className={styles.one_day}>{day || ""}</p>
                                        <div className={styles.one_mood}>
                                            {day && (() => {
                                                const dateKey = getLocalDateString(new Date(currentYear, currentMonth, day));
                                                const moodValue = moodsByDate?.[dateKey]; // mood от 1 до 5
                                                const MoodIcon = moodValue ? moodIcons[moodValue - 1] : null;

                                                return (
                                                    <>
                                                        {MoodIcon && (
                                                            <div className={styles.calendar_mood_icon}>
                                                                <MoodIcon
                                                                    width={window.innerWidth <= 420 ? 8 : 24}
                                                                    height={window.innerWidth <= 420 ? 8 : 24}
                                                                />
                                                            </div>
                                                        )}

                                                        {habitCountsByDate[dateKey] > 0 && (
                                                            <div className={styles.habit_count}>
                                                                {habitCountsByDate[dateKey]}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    <div>
                        <HowManyPercentDone />
                    </div>

                </div>

                <div className={styles.right_block}>
                    <div className={styles.date_block}>
                        <p className={styles.right_date}>
                            {selectedDate ? selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "Выберите дату"}
                        </p>                        
                        <p className={styles.your_habits}>Твои привычки на сегодня 
                            <span className={styles.habit_count_circle}>{activeHabitsForDate.length}</span>
                        </p>
                        
                        <div className={styles.block_filters}>
                            <Filters
                                activeCount={activeCount}
                                completedCount={completedCount}
                                withDateCount={withDateCount}
                                setFilter={setFilter}
                                currentFilter={filter}
                            />

                        </div>
                        <div className={styles.habits}>

                            {filteredHabits.length > 0 ? (
                                filteredHabits.map((habit) => (
                                    <Habit 
                                        key={habit.id} 
                                        habit={habit} 
                                        style={{ 
                                            margin: "10px 0px",
                                            width: "350px",
                                            // whiteSpace: "nowrap",
                                            // overflow: "hidden",
                                            // textOverflow: "ellipsis",
                                            // wordBreak: "break-all",
                                        }} 
                                        selectedDate={getLocalDateString(selectedDate)} // строка "YYYY-MM-DD"
                                    />
                                ))
                            ) : (
                                <p>На эту дату привычек нет.</p>
                            )}

                        </div>

                        <div className={styles.moods_block}>
                            <p className={styles.mood_text}>Какое у вас сегодня настроение?</p>
                            <Moods 
                                style={{ width: "35px", margin: "10px", gap: "0px", }}
                                selectedMood={selectedMood} 
                                selectedDate={selectedDate} 
                                userId={userId}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
