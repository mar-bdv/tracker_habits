import styles from "./Filters.module.scss";


const Filters = ({ 
    activeCount, 
    completedCount, 
    withDateCount, 
    setFilter, 
    currentFilter 
}) => {
    const getClass = (type) =>
        currentFilter === type ? styles.active : "";

    return (
        <div className={styles.filters}>
        <p
            className={getClass("active")}
            onClick={() => setFilter("active")}
        >
            Активные ({activeCount})
        </p>
        <p
            className={getClass("completed")}
            onClick={() => setFilter("completed")}
        >
            Завершенные ({completedCount})
        </p>
        <p
            className={getClass("withDate")}
            onClick={() => setFilter("withDate")}
        >
            С датой ({withDateCount})
        </p>
        </div>
    );
};

export default Filters;