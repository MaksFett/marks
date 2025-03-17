import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import "../Header.css";
import axios from "axios";

const Header: React.FC = observer(() => {
    const { userStore } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        userStore.checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/user_api/users/logout');
            userStore.logout();
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
                    {userStore.isAuth ? (
                        <>
                            <li><Link to="/profile">Личный кабинет</Link></li>
                            <li>
                                <span>Здравствуйте, {userStore.user?.login}</span> {/* Показываем имя пользователя */}
                            </li>
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
