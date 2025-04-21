import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import WelcomePage from "./pages/Welcome/WelcomePage";
import SignIn from "./pages/Welcome/SignIn";
import SignUp from "./pages/Welcome/SignUp";
import Home from "./pages/Home/Home";
import Habits from "./pages/Habits/Habits";
import Layout from "./pages/Layout/Layout";
import { Calendar } from "./pages/Calendar/Calendar";
import { Settings } from "./pages/Settings/Settings";
import Auth from "./Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./store/authSlice";
import PrivateRoute from "./PrivateRoute";

// function App() {

//     const dispatch = useDispatch();
//     const { user, loading } = useSelector(state => state.auth);

//     useEffect(() => {
//         dispatch(getCurrentUser());
//     }, [dispatch]);

//     return (
//         <Router>
//             <Routes>
//                 <Route path="/welcomePage" element={<WelcomePage />} />
//                 <Route path="/signup" element={<SignUp />} />
//                 <Route path="/signin" element={<SignIn />} />
//                 <Route path="/" element={<Layout />}>
//                     <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
//                     <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
//                     <Route path="auth" element={<PrivateRoute><Auth /></PrivateRoute>} />
//                     <Route path="habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
//                     <Route path="calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
//                     <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
//                 </Route>
//             </Routes>
//         </Router>
//     );
// }

// export default App;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getCurrentUser } from "./store/authSlice";
// import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

function App() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (!loading) {
        if (user && location.pathname === "/welcomePage") {
            navigate("/home", { replace: true });
        }
        if (!user && !["/welcomePage", "/signin", "/signup"].includes(location.pathname)) {
            navigate("/welcomePage", { replace: true });
        }
    }

    if (loading) return <div>Загрузка...</div>;

    return (
        <Routes>
            <Route path="/welcomePage" element={<WelcomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Layout />}>
                <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="auth" element={<PrivateRoute><Auth /></PrivateRoute>} />
                <Route path="habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
                <Route path="calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
                <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
