import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";

const WelcomePage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>трекер привычек</h1>
            <div className={styles.options}>
                <p className={styles.start_text}>Выберите, как хотите начать:</p>
                {/* ИЗМЕНИТЬ ССЫЛКИ */}
                <div className={styles.block_link}>
                    <Link to="/home" className={styles.btn_link}>Войти в демо аккаунт</Link>
                    <p className={styles.text}>Попробовать прямо сейчас, данные сохраняются только на вашем устройстве</p>
                </div>

                <div className={styles.block_link}>
                        <Link to="/signup" className={styles.btn_link}>Создать свой аккаунт</Link>
                    <p className={styles.text}>Создайте свой профиль, чтобы синхронизировать данные между устройствами</p>
                </div>
                
                <div className={styles.block_link}>
                        <Link to="/signin" className={styles.btn_link}>Войти в аккаунт</Link>
                    <p className={styles.text}>Если уже есть аккаунт</p>
                </div>
            </div>
            
        </div>
    );
};

export default WelcomePage;