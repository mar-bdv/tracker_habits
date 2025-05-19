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

    // return (
    //     <div className={styles.filters}>
    //     <p
    //         className={getClass("active")}
    //         onClick={() => setFilter("active")}
    //     >
    //         Активные 
    //         <span className={styles.filter_count}>{activeCount}</span>
    //     </p>
    //     <p
    //         className={getClass("completed")}
    //         onClick={() => setFilter("completed")}
    //     >
    //         Завершенные 
    //         <span className={styles.filter_count}>{completedCount}</span>
    //     </p>
    //     <p
    //         className={getClass("withDate")}
    //         onClick={() => setFilter("withDate")}
    //     >
    //         С датой 
    //         <span className={styles.filter_count}>{withDateCount}</span>
    //     </p>
    //     </div>
    // );

    return (
        <div className={styles.filters}>
        <p
            className={`${styles.filter_name} ${getClass("active")}`}
            onClick={() => setFilter("active")}
        >
            Активные 
            <span className={styles.filter_count}>{activeCount}</span>
        </p>
        <p
            className={`${styles.filter_name} ${getClass("completed")}`}
            onClick={() => setFilter("completed")}
        >
            Завершенные 
            <span className={styles.filter_count}>{completedCount}</span>
        </p>
        <p
            className={`${styles.filter_name} ${getClass("withDate")}`}
            onClick={() => setFilter("withDate")}
        >
            С датой 
            <span className={styles.filter_count}>{withDateCount}</span>
        </p>
        </div>
    );
};

export default Filters;