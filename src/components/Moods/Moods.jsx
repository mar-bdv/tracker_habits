// import styles from "./Moods.module.scss";
import { ReactComponent as OneMood } from '../../images/1_mood.svg';
import { ReactComponent as TwoMood } from '../../images/2_mood.svg';
import { ReactComponent as ThreeMood } from '../../images/3_mood.svg';
import { ReactComponent as FourMood } from '../../images/4_mood.svg';
import { ReactComponent as FiveMood } from '../../images/5_mood.svg';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Moods.module.scss';
import { setMoodForDate, setTodayMood } from '../../store/moodsSlice'
import { getLocalDateString } from '../../utils/date';

export const moodIcons = [OneMood, TwoMood, ThreeMood, FourMood, FiveMood];

const Moods = ({ style, selectedMood, selectedDate }) => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user?.id);


    const isTodayDate = (date) => {
        const today = new Date();
        if (!date) return false; 
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };


    const todayMood = useSelector(state => state.moods.todayMood?.mood); // от 1 до 5
    const selectedMoodValue = isTodayDate(selectedDate) ? todayMood : selectedMood;

    // const handleClick = (index) => {
    //     if (!userId) return;
    //     const moodValue = index + 1;
    //     const dateStr = getLocalDateString(selectedDate);

    //     if (isTodayDate(selectedDate)) {
    //         dispatch(setTodayMood({ userId, mood: moodValue }));
    //     } else {
    //         dispatch(setMoodForDate({ userId, date: dateStr, mood: moodValue }));
    //     }
    // };

    const handleClick = (index) => {
        if (!userId) return;

        const moodValue = index + 1;
        const dateStr = getLocalDateString(selectedDate);

        const isSameMoodSelected = selectedMoodValue === moodValue;

        if (isTodayDate(selectedDate)) {
            dispatch(setTodayMood({ userId, mood: isSameMoodSelected ? null : moodValue }));
        } else {
            dispatch(setMoodForDate({ userId, date: dateStr, mood: isSameMoodSelected ? null : moodValue }));
        }
    };


    return (
        <div className={styles.moods}>
            {moodIcons.map((Icon, i) => (
                <div
                    key={i}
                    className={`${styles.mood_wrapper} ${selectedMoodValue === i + 1 ? styles.selected : ''}`}
                    style={style}
                    onClick={() => handleClick(i)}
                >
                    <Icon className={styles.mood_icon} />
                </div>
            ))}
        </div>
    );
};

export default Moods;