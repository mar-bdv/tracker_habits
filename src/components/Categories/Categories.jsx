
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Categories.module.scss";
import deleteImg from "../../images/delete_btn.png"
import { deleteCategory, fetchCategories, hideCategoryForUser } from "../../store/categoriesSlice";
import { motion } from "motion/react"

const Categories = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user.id);
  const { categories, status } = useSelector((s) => s.categories);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (userId && status === "idle") {
      dispatch(fetchCategories(userId));
    }
  }, [userId, status, dispatch]);

  const toggleSelect = (id) => {
    let next;
    if (selected.includes(id)) {
      next = selected.filter((x) => x !== id);
    } else {
      next = [...selected, id];
    }
    setSelected(next);
    onFilterChange(next);
  };

  const handleDelete = (cat) => {
    if (window.confirm("Вы уверены, что хотите удалить категорию? (это действие безвозвратно)")) {
      if (cat.is_system) {
        dispatch(hideCategoryForUser({ userId, categoryId: cat.id }));
      } else {
        dispatch(deleteCategory(cat.id));
      }
    }
  };

  const handleShowAll = () => {
    setSelected([]);
    onFilterChange([]);
  };

  if (status === "loading") return <p>Загрузка категорий...</p>;

  return (
    <div className={styles.categories}>
      <motion.label
        className={`${styles.one_category} ${selected.length === 0 ? styles.selected : ""}`}
        onClick={handleShowAll}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Отобразить все</span>
      </motion.label>

      {categories.length === 0 ? (
        <p className={styles.empty}>Нет категорий</p>
      ) : (
        categories.map((cat) => (
          <motion.div 
            key={cat.id} 
            className={`${styles.one_category} ${selected.includes(cat.id) ? styles.selected : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`${styles.category_name}`}
              onClick={() => toggleSelect(cat.id)}
            >
              {cat.name}
            </span>

            <button
              className={styles.close_icon}
              title="Удалить категорию"
              onClick={() => handleDelete(cat)}
            >
              <img src={deleteImg} alt="×" />
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
};

// const Categories = ({ onFilterChange }) => {
//   const dispatch = useDispatch();
//   const userId = useSelector((s) => s.auth.user.id);
//   const { categories, status } = useSelector((s) => s.categories);
  
//   // локальный стейт выбранных для фильтрации
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     if (userId && status === "idle") {
//       dispatch(fetchCategories(userId));
//     }
//   }, [userId, status, dispatch]);

//   const toggleSelect = (id) => {
//     const next = selected.includes(id)
//       ? selected.filter((x) => x !== id)
//       : [...selected, id];
//     setSelected(next);
//     onFilterChange(next);
//   };

//   const handleDelete = (cat) => {
//     if (window.confirm("Точно удалить категорию?")) {
//       if (cat.is_system ) {
//         dispatch(hideCategoryForUser({ userId, categoryId: cat.id }));
//       } else {
//         dispatch(deleteCategory(cat.id));
//       }
//     }

//     else {
//       return;
//     }
//   };

//   if (status === "loading") return <p>Загрузка категорий...</p>;

//   return (
//     <div className={styles.categories}>
//       <label className={styles.one_category}>
//         <span>Отобразить все</span>
//       </label>
      

//         {categories.map(cat => (
//           <div key={cat.id} className={styles.one_category}>
//             <span
//               className={styles.category_name}
//               onClick={() => toggleSelect(cat.id)}
//             >
//               {cat.name}
//             </span>

//             <button
//               className={styles.close_icon}
//               title="Удалить категорию"
//               onClick={() => handleDelete(cat)}
//             >
//               <img src={deleteImg} alt="×" />
//             </button>
//           </div>
//         ))}
//       </div>
//     );
// };

export default Categories;