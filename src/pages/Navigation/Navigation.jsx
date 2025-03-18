import styles from "./Navigation.module.scss";
import linkImg from '../../images/link.png'
import { Link } from "react-router-dom";

const Navigation = () => {
    
    return (
        <div className={styles.container}>
            <div className={styles.block_avatar}>
                <img className={styles.img} src="https://i.pinimg.com/736x/b5/32/c4/b532c400c00d2099a6462729ccf88e26.jpg"/>
                <p className={styles.nickname}>Name</p>
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
                <Link to="/welcomePage"  className={styles.exit}>
                    Выйти <img src={linkImg} alt="link arrow" className={styles.link_img} />
                </Link>
            </div>
        </div>
    )
}

export default Navigation;