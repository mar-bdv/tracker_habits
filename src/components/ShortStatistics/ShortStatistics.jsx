import styles from "./ShortStatistics.module.scss";


const ShortStatistics = () => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })
    .replace(" г.", "") + " год";


    return (
        <div className={styles.statistics_block}>
            <p className={styles.statistics_text}>Краткая статистика на сегодня:</p>
            <p className={styles.statistics_text}>{formattedDate}</p>
        </div>
    )
}

export default ShortStatistics;