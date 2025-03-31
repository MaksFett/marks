import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../Header.css";
import { selectIsAuth, setAuthState } from "../store/slices/authSlice";
import { useGetLoginMutation, useRefreshMutation, useLogoutUserMutation } from "../store/slices/userApiSlice";

const Header: React.FC = () => {
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();
    const [getLogin] = useGetLoginMutation();
    const [refresh] = useRefreshMutation();
    const [logout] = useLogoutUserMutation();

    useEffect(() => {
        getLogin().unwrap()
            .then(() => setAuthState(true))
            .catch((error) => {
                console.log(isAuth)
                if (error.status === 401) 
                    refresh().unwrap()
                        .then(() => setAuthState(true))
                        .catch(() => setAuthState(false));
                
                else setAuthState(false);
            });
        console.log(isAuth);
    }, [getLogin, refresh]);

    const handleLogout = () => {
        logout().unwrap()
            .then(() => setAuthState(false))
            .catch()
        navigate("/"); // Перенаправляем на главную страницу
    };

    return (
        <header className="header">
            <nav>
                <ul className="navList">
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/grades">Список оценок</Link></li>
                    {/* Если пользователь авторизован, показываем "Выход", иначе "Вход" и "Регистрация" */}
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
};

export default Header;
