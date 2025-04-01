import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../stores/AuthStore";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const {
        login,
        password,
        message,
        isLoading,
        setLogin,
        setPassword,
        clearMessage,
        loginUser,
    } = authStore;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await loginUser();
        if (success) {
            navigate("/");
        }
    };

    const isFormValid = login.trim() !== "" && password.trim() !== "";

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => {
                    setLogin(e.target.value);
                    clearMessage();
                }}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessage();
                }}
            />
            <button
                type="submit"
                disabled={!isFormValid || isLoading}
                style={{
                    backgroundColor: isFormValid ? "#007bff" : "#ccc",
                    cursor: isFormValid ? "pointer" : "not-allowed",
                }}
            >
                {isLoading ? "Загрузка..." : "Войти"}
            </button>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
            </p>
            {message && <div>{message}</div>}
        </form>
    );
};

export default observer(Login);
