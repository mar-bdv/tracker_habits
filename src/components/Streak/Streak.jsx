import styles from "./Streak.module.scss";


const Streak = () => {

    return (
        <div className={styles.filters}>
            <p>Ваш стрейк</p>
            <p>5 дней подряд!</p>
        </div>
    )
}

export default Streak;