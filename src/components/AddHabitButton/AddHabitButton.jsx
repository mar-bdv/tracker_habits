import styles from "./AddHabitButton.module.scss";


const AddHabitButton = () => {

    return (
        <div className={styles.button_container}>
            <button className={styles.button}>Добавить новую привычку</button>
        </div>
    )
}

export default AddHabitButton;