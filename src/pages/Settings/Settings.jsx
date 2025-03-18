import { useState } from "react";
import styles from "./Settings.module.scss"


export const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.header_block}>
                <p className={styles.header}>Настройки</p>
            </div>

            <div className={styles.settings_block}>
                <div className={styles.top_block}>
                    <div className={styles.img_block}>
                        <img className={styles.img} src="https://i.pinimg.com/736x/b5/32/c4/b532c400c00d2099a6462729ccf88e26.jpg" alt="avatar"/>
                        <br/>
                        <button className={styles.img_btn}>Обновить изображение</button>
                    </div>

                    <div className={styles.changeName_block}>
                        <p className={styles.changeName_p}>Сменить имя</p>
                        <div className={styles.input_block}>
                            <input type="text" name="" id="" className={styles.input} />
                            <button className={styles.save_btn}>Сохранить</button>

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