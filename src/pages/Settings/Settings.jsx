import { useEffect, useState } from "react";
import styles from "./Settings.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, updateAvatar, updateNickname } from "../../store/authSlice";
import AddImage from "../../components/AddImage/AddImage";
import { deleteAllHabits } from "../../store/habitsSlice";
import ResetHabitsModal from "../../feautures/ResetHabitsModal/ResetHabitsModal";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../../feautures/DeleteAccountModal/DeleteAccountModal";


export const Settings = () => {
    const [nicknameInput, setNicknameInput] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

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

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);


    return (
        <div className={styles.container}>
            <div className={styles.mini_container}>
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
                                    maxLength={20}
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
                        <button 
                            className={styles.del_btn}
                            onClick={() => setShowResetModal(true)}
                        >
                            Сбросить все привычки
                        </button>
                        {/* <button 
                            className={styles.del_btn}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Снести аккаунт
                        </button> */}
                    </div>

                    {showResetModal && (
                        <ResetHabitsModal
                            onConfirm={() => {
                                if (user) dispatch(deleteAllHabits(user.id));
                                setShowResetModal(false);
                            }}
                            onCancel={() => setShowResetModal(false)}
                        />
                    )}

                    {showDeleteModal && (
                        <DeleteAccountModal
                            onConfirm={async () => {
                            if (user) {
                                await dispatch(deleteAccount(user.id));
                                setShowDeleteModal(false);
                                navigate("/WelcomePage");
                            }
                            }}
                            onCancel={() => setShowDeleteModal(false)}
                        />
                    )}

                </div>
            </div>
        </div>
    )
}