import styles from "./HowManyPercentDone.module.scss";
import percentImg from '../../images/percent.png'


const HowManyPercentDone = () => {

    return (
        <div className={styles.filters}>
            <p>Сколько % привычек выполнено:</p>
            <img src={percentImg} alt="Процент выполненных привычек" />
            <p>40%</p>
        </div>
    )
}

export default HowManyPercentDone;