// import styles from "./Categories.module.scss";
// import deleteImg from "../../images/delete_btn.png"

// const Categories = () => {
//     const categories = ["обучение", "здоровье", "спорт", "работа"];

//     return (
//         <div className={styles.categories}>
//             {categories.map((category, index) => (
//                 <p key={index} className={styles.one_category}>
//                 {category}
//                 <span className={styles.close_icon} onClick={() => console.log(`Удалить: ${category}`)}>
//                     <img src={deleteImg} alt="deleteImg" />
//                 </span>
//                 </p>
//             ))}
//         </div>
//     )
// }

// export default Categories;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Categories.module.scss";
import deleteImg from "../../images/delete_btn.png"
import { deleteCategory, fetchCategories, hideCategoryForUser } from "../../store/categoriesSlice";

const Categories = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user.id);
  const { categories, status } = useSelector((s) => s.categories);
  
  // локальный стейт выбранных для фильтрации
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (userId && status === "idle") {
      dispatch(fetchCategories(userId));
    }
  }, [userId, status, dispatch]);

  const toggleSelect = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    onFilterChange(next);
  };

  const handleDelete = (cat) => {
    if (cat.is_system) {
      dispatch(hideCategoryForUser({ userId, categoryId: cat.id }));
    } else {
      dispatch(deleteCategory(cat.id));
    }
  };

  if (status === "loading") return <p>Загрузка категорий...</p>;

  return (
    <div className={styles.categories}>
      {categories.map((cat) => (
        <label key={cat.id} className={styles.one_category}>
          <input
            type="checkbox"
            checked={selected.includes(cat.id)}
            onChange={() => toggleSelect(cat.id)}
          />
          <span>{cat.name}</span>
          <button
            className={styles.close_icon}
            onClick={() => handleDelete(cat)}
            title={cat.is_system ? "Скрыть" : "Удалить"}
          >
            <img src={deleteImg} alt="×" />
          </button>
        </label>
      ))}
    </div>
    );
};

export default Categories;