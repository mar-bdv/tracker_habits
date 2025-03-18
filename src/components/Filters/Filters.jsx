import styles from "./Filters.module.scss";


const Filters = () => {

    return (
        <div className={styles.filters}>
            <p>Активные (1)</p>
            <p>Завершенные (5)</p>
            <p>С датой (2)</p>
        </div>
    )
}

export default Filters;