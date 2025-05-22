import styles from "./Navigation.module.scss";
import linkImg from '../../images/link.png'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../store/authSlice";


const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        await dispatch(signOutUser());
        navigate("/welcomePage", { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.block_avatar}>
                <img className={styles.img} src={user?.avatar_url}/>
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
        </div>
    );
}

export default Navigation;
