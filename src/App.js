import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcome/WelcomePage";
import SignIn from "./pages/Welcome/SignIn";
import SignUp from "./pages/Welcome/SignUp";
import Home from "./pages/Home/Home";
import Habits from "./pages/Habits/Habits";
import Layout from "./pages/Layout/Layout";
import { Calendar } from "./pages/Calendar/Calendar";
import { Settings } from "./pages/Settings/Settings";
import Auth from "./Auth";

function App() {
    return (
        <Router>
        <Routes>
            
            <Route path="/welcomePage" element={<WelcomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Layout />}>
            
                <Route path="/home" element={<Home/>} />
                <Route path="/auth" element={<Auth />} />

                <Route path="/habits" element={<Habits />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
        </Router>
    );
}

export default App;