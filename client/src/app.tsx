import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import GradeList from "./pages/GradeList";
import "./styles.css";
import "./Header.css";

const App: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token"); // Проверка, вошёл ли пользователь

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/grades" element={isAuthenticated ? <GradeList /> : <Navigate to="/login" />} />
                <Route path="/grades/:id" element={isAuthenticated ? <GradeList /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
