import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header.css"; // Импортируем CSS-файл

const Header: React.FC = () => {
    const navigate = useNavigate();
    
    // Проверяем наличие токена в localStorage
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        // Удаляем токен из localStorage при выходе
        localStorage.removeItem("token");
        navigate("/"); // Перенаправляем на главную страницу
    };

    return (
        <header className="header">
            <nav>
                <ul className="navList">
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/grades">Список оценок</Link></li>
                    <li><Link to="/profile">Личный кабинет</Link></li>
                    {/* Если пользователь авторизован, показываем "Выход", иначе "Вход" и "Регистрация" */}
                    {isAuthenticated ? (
                        <li><button className="logout-btn" onClick={handleLogout}>Выход</button></li>
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
};

export default Header;
