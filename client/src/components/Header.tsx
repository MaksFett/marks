import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProps } from "../types";
import "../Header.css";
import axios from "axios";

const Header: React.FC<AuthProps> = ({isAuth, setisauth}) => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user_api/users/get_login', {headers: { "Authorization": "Bearer " + localStorage.getItem("access-token")}})
            .then(() => setisauth(true))
            .catch((error) => {
                if (error.response.status == 401) 
                    axios.post('/user_api/users/refresh', {headers: { "Authorization": "Bearer " + localStorage.getItem("refresh-token")}})
                        .then(() => setisauth(true))
                        .catch(() => {setisauth(false); navigate('/login');});
                
                else { setisauth(false); navigate('/login'); }
            });
    }, []);

    const handleLogout = () => {
        axios.get('/user_api/users/logout', {headers: { "Authorization": "Bearer " + localStorage.getItem("access-token")}})
<<<<<<< HEAD
            .then(() => {localStorage.clear(); setisauth(false); })
            .catch()
=======
        localStorage.clear(); 
        setisauth(false);
>>>>>>> 70f1399c71cf23c56556f59563f35ed4b54d1b01
        navigate("/login");
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
