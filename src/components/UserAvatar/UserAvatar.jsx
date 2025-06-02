import styles from "../../pages/Navigation/Navigation.module.scss";
import { useSelector } from "react-redux";

const UserAvatar = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className={styles.block_avatar}>
            <img className={styles.img} src={user?.avatar_url || 'https://i.ibb.co/3y45FgtQ/img.png'}/>

            <p className={styles.nickname}>{user?.nickname || 'Пользователь'} </p>
        </div>
    );
};

export default UserAvatar;