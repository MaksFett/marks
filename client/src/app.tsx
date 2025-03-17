import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import GradeList from "./pages/GradeList";
import "./styles.css";
import "./Header.css";

const App: React.FC = () => {
    const [isAuth, setisauth] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/grades" element={<GradeList />} />
                <Route path="/grades/:id" element={<GradeList />} />
            </Routes>
        </Router>
    );
};

export default App;
