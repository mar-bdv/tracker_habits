import { useState } from 'react';
import styles from './AddImage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAvatar, updateAvatar } from '../../store/authSlice';


const AddImage = () => {
    const dispatch = useDispatch();

    const [avatarUrl, setAvatarUrl] = useState('');
    const user = useSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleUpdateAvatar = () => {
        if (!avatarUrl.trim()) return;

        if (!isValidUrl(avatarUrl)) {
            setIsInvalid(true);
            alert("Введите действительный URL, например: https://example.com/avatar.png");
            return;
        }

        setIsInvalid(false);
        dispatch(updateAvatar({ avatarUrl, userId: user.id }));
        setIsEditing(false);
        setAvatarUrl('');
    };

    const handleDeleteAvatar = () => {
        dispatch(deleteAvatar(user.id));
        setIsEditing(false);
        setAvatarUrl('');
    };


    return (
        <div className={styles.img_block}>
            <img
                className={styles.img}
                src={user.avatar_url || '/default-avatar.png'}
                alt="Аватар"
            />

            {!isEditing ? (
                <p
                    className={styles.updateText}
                    onClick={() => setIsEditing(true)}
                >
                    Обновить изображение
                </p>
            ) : (
                <div className={`${styles.inputGroup} ${isEditing ? styles['inputGroup--visible'] : ''}`}>
                    <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => {
                            setAvatarUrl(e.target.value);
                        }}
                        placeholder="https://example.com/avatar.png"
                        className={styles.input}

                    />
                    <div className={styles.btns_container}>
                        <button onClick={handleUpdateAvatar} className={styles.button}>
                            Обновить
                        </button>
                        {user.avatar_url && (
                            <button onClick={handleDeleteAvatar} className={styles.button}>
                                Удалить
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


export default AddImage;