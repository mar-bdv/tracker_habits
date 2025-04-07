import { useEffect, useState } from "react";
import HowManyPercentDone from "../../components/HowManyPercentDone/HowManyPercentDone";
import styles from "./Calendar.module.scss";
import leftArrow from "../../images/left_arrow_month.png"
import rightArrow from "../../images/right_arrow_month.png"
import Filters from "../../components/Filters/Filters";
import Habit from "../../components/Habit/Habit";
import Moods from "../../components/Moods/Moods";
import { useDispatch, useSelector } from "react-redux";


export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const habits = useSelector((state) => state.habits);
    const dispatch = useDispatch();

    const handleDayClick = (day) => {
        if (!day) return; // Игнорируем пустые ячейки
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    useEffect(() => {
        setSelectedDate(new Date());
    }, []);
    
    // Функция для получения количества дней в месяце
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Функция для получения дня недели первого числа месяца (0 - понедельник, 1 - вторник, ...)
    const getFirstDayOfMonth = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        // Смещаем день недели, чтобы понедельник был первым днем (0)
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    // Функция для получения названия месяца
    const getMonthName = (month) => {
        const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        return months[month];
    };

    // Функция для изменения месяца
    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);

        // Ограничиваем переход месяцами в диапазоне от 3 месяцев назад до 3 месяцев вперед
        if (newDate.getMonth() < currentDate.getMonth() - 3 || newDate.getMonth() > currentDate.getMonth() + 3) {
        return;
        }

        setCurrentDate(newDate);
    };

    // Данные для текущего месяца
    const currentMonth = currentDate.getMonth(); // Месяц (0-11)
    const currentYear = currentDate.getFullYear(); // Год

    // Получаем количество дней в текущем месяце и первый день месяца
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

    // Создаем массив для календаря
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Заполняем пустыми ячейками перед первым днем месяца
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);

    // Объединяем пустые ячейки и дни месяца
    const calendarDays = [...emptyCells, ...daysArray];
    
    return (
        <div className={styles.container}>
            <div className={styles.heading_block}>
                <h2 className={styles.heading}>Календарь</h2>
            </div>

            <div className={styles.container_calendar}>
                <div className={styles.calendar_block}>
                    <div className={styles.navigation}>
                        {/* Стрелка назад */}
                        <button
                            className={styles.arrow}
                            onClick={() => changeMonth(-1)}
                            disabled={currentDate.getMonth() <= new Date().getMonth() - 3} // Ограничиваем назад на 3 месяца
                        >
                            <img src={leftArrow} alt="стрелка влево" />
                        </button>

                        {/* Название месяца */}
                        <div className={styles.monthName}>{getMonthName(currentMonth)} {currentYear}</div>

                        {/* Стрелка вперед */}
                        <button
                            className={styles.arrow}
                            onClick={() => changeMonth(1)}
                            disabled={currentDate.getMonth() >= new Date().getMonth() + 3} // Ограничиваем вперед на 3 месяца
                        >
                            <img src={rightArrow} alt="стрелка вправо" />

                        </button>
                    </div>

                    <div className={styles.calendar}>
                        {/* Дни недели */}
                        <div className={styles.weekdays}>
                            {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map((day, index) => (
                            <div key={index}>{day}</div>
                            ))}
                        </div>

                        {/* Дни месяца */}
                        <div className={styles.days}>
                            {calendarDays.map((day, index) => (
                                <div 
                                key={index} 
                                className={`${styles.day} ${selectedDate?.getDate() === day ? styles.selected : ""}`} 
                                onClick={() => handleDayClick(day)}
                                >
                                    {day || ""}
                                </div>
                            ))}
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
                    <p className={styles.your_habits}>Твои привычки на сегодня (10)</p>
                        
                        <div className={styles.block_filters}>
                            <Filters />

                        </div>
                        <div className={styles.habits}>

                            {habits.map((habit) => (
                                <Habit key={habit.id} habit={habit} style={{ margin: "10px 0px", width: "95%" }} />
                            ))}

                        </div>

                        <div className={styles.moods_block}>
                            <p className={styles.mood_text}>Какое у вас сегодня настроение?</p>
                            <Moods style={{ width: "35px", margin: "10px" }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
