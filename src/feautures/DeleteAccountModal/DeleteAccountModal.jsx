import styles from "./DeleteAccountModal.module.scss";

const DeleteAccountModal = ({ onConfirm, onCancel }) => (

    <div className={styles.overlay}>
        <div className={styles.modal}>
            <p className={styles.modal_heading}>Вы уверены, что удалить аккаунт?</p>
            <div className={styles.buttons}>
                <button className={styles.confirm} onClick={onConfirm}>Да</button>
                <button className={styles.cancel} onClick={onCancel}>Нет</button>
            </div>
        </div>
    </div>
);

export default DeleteAccountModal;