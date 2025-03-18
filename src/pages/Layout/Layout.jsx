import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss"; 
import Navigation from "../Navigation/Navigation";

const Layout = () => {
    return (
        <div className={styles.container}>
            <Navigation />
            <div className={styles.content}>
                <Outlet /> {/* Здесь рендерятся страницы */}
            </div>
        </div>
    );
};

export default Layout;