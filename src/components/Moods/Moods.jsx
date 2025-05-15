// import styles from "./Moods.module.scss";
import { ReactComponent as OneMood } from '../../images/1_mood.svg';
import { ReactComponent as TwoMood } from '../../images/2_mood.svg';
import { ReactComponent as ThreeMood } from '../../images/3_mood.svg';
import { ReactComponent as FourMood } from '../../images/4_mood.svg';
import { ReactComponent as FiveMood } from '../../images/5_mood.svg';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Moods.module.scss';
import { setTodayMood } from '../../store/moodsSlice'

export const moodIcons = [OneMood, TwoMood, ThreeMood, FourMood, FiveMood];

const Moods = ({ style }) => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user?.id);
    const todayMood = useSelector(state => state.moods.todayMood?.mood); // от 1 до 5

    const handleClick = (index) => {
        if (!userId) return;
        const moodValue = index + 1;
        dispatch(setTodayMood({ userId, mood: moodValue }));
        console.log("mood one")
    };

    return (
        <div className={styles.moods}>
            {/* {moodImages.map((img, i) => (
                <img
                    key={i}
                    className={`${styles.mood_img} ${todayMood === i + 1 ? styles.selected : ''}`}
                    style={style}
                    src={img}
                    alt={`mood-${i + 1}`}
                    onClick={() => handleClick(i)}
                />
            ))} */}
            {moodIcons.map((Icon, i) => (
                <div
                    key={i}
                    className={`${styles.mood_wrapper} ${todayMood === i + 1 ? styles.selected : ''}`}
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
