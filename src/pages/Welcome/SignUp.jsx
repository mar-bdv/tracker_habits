// import { Link } from "react-router-dom";
// import styles from "./WelcomePage.module.scss";

// const SignUp = () => {
//     return (
//         <div className={styles.container}>
//             <h1 className={styles.heading}>трекер привычек</h1>
//             <div className={styles.options_input}>
//                 <p className={styles.start_text_signup}>Создайте свой аккаунт!</p>
                
//                 <div className={styles.block_input}>
//                     <p className={styles.text_input}>Имя</p>
//                     <input type="text" className={styles.input} placeholder="Мария Ивановна"/>
//                 </div>

//                 <div className={styles.block_input}>
//                     <p className={styles.text_input}>Email*</p>
//                     <input type="text" className={styles.input} placeholder="maria@gmail.com"/>
//                     <p className={styles.descr_input}>*без строгой валидации, можно ввести фейковый</p>
//                 </div>

//                 <div className={styles.block_input}>
//                     <p className={styles.text_input}>Пароль*</p>
//                     <input type="text" className={styles.input} placeholder="Придумайте пароль"/>
//                     <p className={styles.descr_input}>*минимум 6 символов</p>
                    
//                 </div>
                
//                 <div className={styles.block_btns}>
//                     <a href="/" className={styles.btn_link}>Зарегистрироваться</a>
//                     <div className={styles.block_link}>
//                         <p className={styles.text_link}>Уже есть аккаунт? <Link to="/signin" className={styles.link}>Войти в аккаунт</Link></p>
//                         <p className={styles.text_link}>Попробовать <Link to="/" className={styles.link}>демо</Link> без регистрации</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignUp;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../store/authSlice";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";

const SignUp = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signUpUser({ email, password, username }));
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                </div>

                <button type="submit" className={styles.btn_link} disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>

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
