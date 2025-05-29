
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../../store/authSlice";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"

const SignIn = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signInUser({ email, password }));
    };

    useEffect(() => {
        if (user) navigate("/home");
    }, [user, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Вход в аккаунт</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                </div>

                <div className={styles.block_input}>
                    <p className={styles.text_input}>Пароль*</p>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <motion.button 
                    type="submit" 
                    className={styles.btn_link} 
                    disabled={loading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? "Загрузка..." : "Войти"}
                </motion.button>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.block_link}>
                    <p className={styles.text_link}>Нет аккаунта? <Link to="/signup" className={styles.link}>Создайте его</Link> за минуту!</p>
                    <p className={styles.text_link}>Попробовать <Link to="/" className={styles.link}>демо</Link> без регистрации</p>
                </div>
            </form>
        </div>
    );
};

export default SignIn;
