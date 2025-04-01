import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Header.css";
import { selectIsAuth, setAuthState } from "../store/slices/authSlice";
import { useGetLoginMutation, useRefreshMutation, useLogoutUserMutation } from "../store/slices/userApiSlice";

const Header: React.FC = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [getLogin] = useGetLoginMutation();
    const [refresh] = useRefreshMutation();
    const [logout] = useLogoutUserMutation();

    useEffect(() => {
        getLogin().unwrap()
            .then(() => {
                dispatch(setAuthState(true));
            })
            .catch((error) => {
                if (error.status === 401 || error.status === 403) 
                    {console.log(1)
                    refresh().unwrap()
                        .then(() => dispatch(setAuthState(true)))
                        .catch(() => dispatch(setAuthState(false)));
                    console.log(2)}
                else dispatch(setAuthState(false));
            });
    }, []);

    const handleLogout = () => {
        logout().unwrap()
            .then(() => {
                localStorage.clear();
                dispatch(setAuthState(false));
            })
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
