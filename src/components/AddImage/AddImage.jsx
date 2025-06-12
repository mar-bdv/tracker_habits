import { useState } from 'react';
import styles from './AddImage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAvatar, updateAvatar } from '../../store/authSlice';
import { AnimatePresence, motion } from 'framer-motion'
import defaultAvatar from '../../images/default_avatar.png'

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
                src={user.avatar_url || defaultAvatar}
                alt="Аватар"
            />

            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.p
                        key="text"
                        className={styles.updateText}
                        onClick={() => setIsEditing(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                    Обновить изображение
                    </motion.p>
                ) : (
                    <motion.div
                        key="box"
                        className={styles.inputGroup}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <input
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
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
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    
    )
}


export default AddImage;