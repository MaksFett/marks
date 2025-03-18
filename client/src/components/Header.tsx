import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProps } from "../types";
import "../Header.css";
import axios from "axios";
import { useGetLoginMutation, useRefreshMutation, useLogoutUserMutation } from "../store/userApiSlice";

const Header: React.FC<AuthProps> = ({isAuth, setisauth}) => {
    const navigate = useNavigate();
    const [getLogin] = useGetLoginMutation();
    const [refresh] = useRefreshMutation();
    const [logout] = useLogoutUserMutation();

    useEffect(() => {
        getLogin(1).unwrap()
            .then(() => setisauth(true))
            .catch((error) => {
                if (error.status == 401) 
                    refresh(1).unwrap()
                        .then(() => setisauth(true))
                        .catch(() => setisauth(false));
                
                else setisauth(false);
            });
    }, []);

    const handleLogout = () => {
        logout(1).unwrap()
            .then(() => setisauth(false))
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
