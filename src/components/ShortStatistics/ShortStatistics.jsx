import styles from "./ShortStatistics.module.scss";


const ShortStatistics = () => {

    return (
        <div className={styles.statistics_block}>
            <p className={styles.statistics_text}>Краткая статистика на сегодня:</p>
            <p className={styles.statistics_text}>21 февраля, 2025 год</p>
        </div>

    )
}

export default ShortStatistics;