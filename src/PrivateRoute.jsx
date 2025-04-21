import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/welcomePage" replace />;
};

export default PrivateRoute;
