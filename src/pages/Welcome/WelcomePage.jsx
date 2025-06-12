import { Link, useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import { motion } from "motion/react"
import { useDispatch } from "react-redux";
import { createDemoUser } from "../../store/authSlice";

const WelcomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDemoLogin = async () => {
        const resultAction = await dispatch(createDemoUser());

        if (createDemoUser.fulfilled.match(resultAction)) {
            navigate('/home');
        } else {
            alert('Ошибка при создании демо-аккаунта:', resultAction.payload)
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>трекер привычек</h1>
            <div className={styles.options}>
                <p className={styles.start_text}>Выберите, как хотите начать:</p>
                <div className={styles.block_link}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button onClick={handleDemoLogin} className={styles.btn_link}>
                            Войти в демо аккаунт
                        </button>
                    </motion.div>
                    <p className={styles.text}>Попробовать прямо сейчас, данные сохраняются только на вашем устройстве</p>
                </div>

                <div className={styles.block_link}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/signup" className={styles.btn_link}>Создать свой аккаунт</Link>
                    </motion.div>
                
                    <p className={styles.text}>Создайте свой профиль, чтобы синхронизировать данные между устройствами</p>
                </div>
                
                <div className={styles.block_link}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/signin" className={styles.btn_link}>Войти в аккаунт</Link>
                    </motion.div>
                    <p className={styles.text}>Если уже есть аккаунт</p>
                </div>
            </div>
            
        </div>
    );
};

export default WelcomePage;