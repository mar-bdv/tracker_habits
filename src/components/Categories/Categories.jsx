import styles from "./Categories.module.scss";
import deleteImg from "../../images/delete_btn.png"

const Categories = () => {
    const categories = ["отобразить все", "обучение", "здоровье", "спорт", "работа"];

    return (
        <div className={styles.categories}>
            {categories.map((category, index) => (
                <p key={index} className={styles.one_category}>
                {category}
                <span className={styles.close_icon} onClick={() => console.log(`Удалить: ${category}`)}>
                    <img src={deleteImg} alt="deleteImg" />
                </span>
                </p>
            ))}
        </div>
    )
}

export default Categories;