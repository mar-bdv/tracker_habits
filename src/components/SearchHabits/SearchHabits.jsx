import React from "react";
import styles from "./SearchHabits.module.scss"; 

const SearchHabits = ({ searchTerm, setSearchTerm }) => {
    return (
        <div>
        <input
            type="text"
            placeholder="Поиск привычек"
            className={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
    );
};

export default SearchHabits;