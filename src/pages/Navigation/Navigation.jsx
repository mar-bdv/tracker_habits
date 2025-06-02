import styles from "./Navigation.module.scss";
import linkImg from '../../images/link.png'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../store/authSlice";
import { useState } from "react";
import UserAvatar from "../../components/UserAvatar/UserAvatar";


const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleLogout = async () => {
        await dispatch(signOutUser());
        navigate("/welcomePage", { replace: true });
    };

    return (
        <>
            {/* Мобильная шапка */}
            <div className={styles.mobile_header}>
                {/* <button
                    className={styles.burger}
                    onClick={() => setMenuOpen(true)}
                    aria-label="Открыть меню"
                >
                    <span />
                    <span />
                    <span />
                </button> */}
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
                        главная <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>   
                    <Link to="/habits" className={styles.link} onClick={() => setMenuOpen(false)}>
                        ваши привычки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>       
                    <Link to="/calendar" className={styles.link} onClick={() => setMenuOpen(false)}>
                        календарь <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                    <Link to="/settings" className={styles.link} onClick={() => setMenuOpen(false)}>
                        настройки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                </ul>
                <div className={styles.block_exit}>
                    <button onClick={async () => { await handleLogout(); setMenuOpen(false); }} className={styles.exit}>
                        Выйти <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </button>
                </div>
            </div>

            {/* <div className={styles.container}>
                <div className={styles.block_avatar}>
                    <img className={styles.img} src={user?.avatar_url || 'https://i.ibb.co/3y45FgtQ/img.png'}/>
                    <p className={styles.nickname}>{user?.nickname || 'Пользователь'}</p>
                </div>

                <ul className={styles.block_links}>
                    <Link to="/home" className={styles.link}>
                        главная <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>   
                    <Link to="/habits" className={styles.link}>
                        ваши привычки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>       
                    <Link to="/calendar" className={styles.link}>
                        календарь <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                    <Link to="/settings" className={styles.link}>
                        настройки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                </ul>

                <div className={styles.block_exit}>
                    <button onClick={handleLogout} className={styles.exit}>
                        Выйти <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </button>
                </div>
            </div> */}
            {/* Десктопное меню */}
            <div className={styles.container}>
                <UserAvatar />
                <ul className={styles.block_links}>
                    <Link to="/home" className={styles.link}>
                        главная <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>   
                    <Link to="/habits" className={styles.link}>
                        ваши привычки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>       
                    <Link to="/calendar" className={styles.link}>
                        календарь <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                    <Link to="/settings" className={styles.link}>
                        настройки <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </Link>
                </ul>
                <div className={styles.block_exit}>
                    <button onClick={handleLogout} className={styles.exit}>
                        Выйти <img src={linkImg} alt="link arrow" className={styles.link_img} />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Navigation;
