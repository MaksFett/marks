// components/Header.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite"; // Для реакции на изменения в store
import { userStore } from "../store/UserStore"; // Подключаем наш store
import "../Header.css";

const Header: React.FC = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        userStore.checkAuthStatus(); // Проверяем статус авторизации при загрузке компонента
    }, []);

    const handleLogout = async () => {
        await userStore.logout();
        navigate("/"); // Перенаправляем на главную страницу
    };

    return (
        <header className="header">
            <nav>
                <ul className="navList">
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/grades">Список оценок</Link></li>
                    {/* Если пользователь авторизован, показываем "Выход" и имя, иначе "Вход" и "Регистрация" */}
                    {userStore.isAuth ? (
                        <>
                            <li><Link to="/profile">Личный кабинет</Link></li>
                            <li>Привет, {userStore.user?.name}</li> {/* Отображаем имя пользователя */}
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
