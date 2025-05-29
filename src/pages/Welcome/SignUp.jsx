import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../store/authSlice";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import { motion } from "motion/react"

const SignUp = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signUpUser({ email, password, nickname }));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Создайте свой аккаунт!</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.block_input}>
                        <p className={styles.text_input}>Имя</p>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Мария Ивановна"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.block_input}>
                        <p className={styles.text_input}>Email*</p>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="maria@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p className={styles.input_warning}>*без строгой валидации, можно ввести фейковый</p>
                    </div>

                    <div className={styles.block_input}>
                        <p className={styles.text_input}>Пароль*</p>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className={styles.input_warning}>*минимум 6 символов</p>
                </div>

                <motion.button 
                    type="submit" 
                    className={styles.btn_link} 
                    disabled={loading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </motion.button>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.block_link}>
                    <p className={styles.text_link}>Уже есть аккаунт? <Link to="/signin" className={styles.link}>Войти</Link></p>
                    <p className={styles.text_link}>Попробовать <Link to="/" className={styles.link}>демо</Link> без регистрации</p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
