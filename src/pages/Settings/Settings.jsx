import { useState } from "react";
import styles from "./Settings.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateNickname } from "../../store/authSlice";
import AddImage from "../../components/AddImage/AddImage";


export const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nicknameInput, setNicknameInput] = useState("");

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const { error, loading } = useSelector(state => state.auth);

    {loading && <p>Загрузка аватара...</p>}
    {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}


    const handleSaveNickname = () => {
        if (user && nicknameInput.trim()) {
            dispatch(updateNickname({ userId: user.id, newNickname: nicknameInput.trim() }));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header_block}>
                <p className={styles.header}>Настройки</p>
            </div>

            <div className={styles.settings_block}>
                <div className={styles.top_block}>
                    <AddImage />

                    <div className={styles.changeName_block}>
                        <p className={styles.changeName_p}>Сменить имя</p>
                        <div className={styles.input_block}>
                            <input
                                type="text"
                                className={styles.input}
                                value={nicknameInput}
                                onChange={(e) => setNicknameInput(e.target.value)}
                                placeholder={"Ваше имя"}
                            />
                            <button className={styles.save_btn} onClick={handleSaveNickname}>
                                Сохранить
                            </button>
                        </div>
                    </div>

                    <div className={styles.themes_btns}>
                        <button
                            className={`${styles.dark_btn} ${isDarkMode ? styles.active : ""}`}
                            onClick={() => setIsDarkMode(true)}
                        >
                            Темный режим
                        </button>
                        <button
                            className={`${styles.light_btn} ${!isDarkMode ? styles.active : ""}`}
                            onClick={() => setIsDarkMode(false)}
                        >
                            Светлый режим
                        </button>
                    </div>
                </div>

                <div className={styles.bottom_block}>
                    <button className={styles.del_btn}>Сбросить все привычки</button>
                    <button className={styles.del_btn}>Снести аккаунт</button>
                </div>

            </div>
        </div>
    )
}