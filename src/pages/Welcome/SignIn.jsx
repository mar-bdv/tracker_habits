import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";


const SignIn = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>трекер привычек</h1>
            <div className={styles.options_input}>
                <p className={styles.start_text_signup}>Вход в аккаунт</p>

                <div className={styles.block_input}>
                    <p className={styles.text_input}>Email*</p>
                    <input type="text" className={styles.input} placeholder="maria@gmail.com"/>
                </div>

                <div className={styles.block_input}>
                    <p className={styles.text_input}>Пароль*</p>
                    <input type="text" className={styles.input} placeholder="Введите пароль"/>
                    
                </div>
                
                <div className={styles.block_btns}>
                    <a href="/" className={styles.btn_link}>Войти</a>
                    <div className={styles.block_link}>
                        <p className={styles.text_link}>Нет аккаунта? <Link to="/signup" className={styles.link}>Создайте его</Link> за минуту!</p>
                        <p className={styles.text_link}>Попробовать <Link to="/" className={styles.link}>демо</Link> без регистрации</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;