import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import userStore from "../stores/UserStore";
import "../Header.css";

const Header: React.FC = observer(() => {
    const { isAuth, checkAuth, logout } = userStore;
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        try {
            logout();
            navigate("/"); // Перенаправляем на главную страницу
        } catch (error) {
            console.error("Ошибка при выходе", error);
        }
    };

    return (
        <header className="header">
            <nav>
                <ul className="navList">
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/grades">Список оценок</Link></li>
                    {isAuth ? (
                        <>
                            <li><Link to="/profile">Личный кабинет</Link></li>
                            <li><button className="logout-btn" onClick={handleLogout}>Выход</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Вход</Link></li>
                            <li><Link to="/register">Регистрация</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
});

export default Header;
