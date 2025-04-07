import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser, signInUser, signOutUser } from "./store/authSlice";

const Auth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            dispatch(signUpUser({ email, password, username }));
        } else {
            dispatch(signInUser({ email, password }));
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <h2>Привет, {user.email}!</h2>
                    <button onClick={() => dispatch(signOutUser())}>Выйти</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Никнейм"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isSignUp ? "Зарегистрироваться" : "Войти"}</button>
                    <p onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                    </p>
                </form>
            )}
            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Auth;
