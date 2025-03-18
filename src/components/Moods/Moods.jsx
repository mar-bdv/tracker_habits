import styles from "./Moods.module.scss";
import OneMood from '../../images/one_mood.png'
import TwoMood from '../../images/two_mood.png'
import ThreeMood from '../../images/three_mood.png'
import FourMood from '../../images/four_mood.png'
import FiveMood from '../../images/five_mood.png'


const Moods = ({ style }) => {

    return (
        <div className={styles.moods}>
            <img className={styles.mood_img} style={style} src={OneMood} alt="mood"/>
            <img className={styles.mood_img} style={style} src={TwoMood} alt="mood"/>
            <img className={styles.mood_img} style={style} src={ThreeMood} alt="mood"/>
            <img className={styles.mood_img} style={style} src={FourMood} alt="mood"/>
            <img className={styles.mood_img} style={style} src={FiveMood} alt="mood"/>
        </div>
    )
}

export default Moods;