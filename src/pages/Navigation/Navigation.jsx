import styles from "./Navigation.module.scss";
import arrowImgLight from '../../images/link.png'
import arrowImgDark from '../../images/link_dark.png'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../store/authSlice";
import { useState } from "react";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { useIsDarkTheme } from "../../utils/useIsDarkTheme";


const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleLogout = async () => {
        await dispatch(signOutUser());
        navigate("/welcomePage", { replace: true });
    };

    const isDark = useIsDarkTheme();
    const arrowImg = isDark ? arrowImgDark : arrowImgLight;


    return (
        <>
            {/* Мобильная шапка */}
            <div className={styles.mobile_header}>
                
                {!menuOpen && (
                    <button
                        className={styles.burger}
                        onClick={() => setMenuOpen(true)}
                        aria-label="Открыть меню"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                )}
            
                <UserAvatar />
            </div>

            {/* Мобильное меню */}
            <div className={`${styles.mobile_menu} ${menuOpen ? styles.open : ""}`}>
                {menuOpen && (
                    <button
                        className={styles.close}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Закрыть меню"
                    >
                        <span />
                        <span />
                    </button>
                )}
                <UserAvatar />
                <ul className={styles.block_links}>
                    <Link to="/home" className={styles.link} onClick={() => setMenuOpen(false)}>
                        главная <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>   
                    <Link to="/habits" className={styles.link} onClick={() => setMenuOpen(false)}>
                        ваши привычки <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>       
                    <Link to="/calendar" className={styles.link} onClick={() => setMenuOpen(false)}>
                        календарь <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                    <Link to="/settings" className={styles.link} onClick={() => setMenuOpen(false)}>
                        настройки <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                </ul>
                <div className={styles.block_exit}>
                    <button onClick={async () => { await handleLogout(); setMenuOpen(false); }} className={styles.exit}>
                        Выйти <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </button>
                </div>
            </div>

            {/* Десктопное меню */}
            <div className={styles.container}>
                <UserAvatar />
                <ul className={styles.block_links}>
                    <Link to="/home" className={styles.link}>
                        главная <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>   
                    <Link to="/habits" className={styles.link}>
                        ваши привычки <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>       
                    <Link to="/calendar" className={styles.link}>
                        календарь <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                    <Link to="/settings" className={styles.link}>
                        настройки <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                </ul>
                <div className={styles.block_exit}>
                    <button onClick={handleLogout} className={styles.exit}>
                        Выйти <img src={arrowImg} alt="link arrow" className={styles.link_img} />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Navigation;
