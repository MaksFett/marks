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
        setLoading,
        setMessage
    } = authStore;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/user_api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access-token", data.accessToken);
                localStorage.setItem("refresh-token", data.refreshToken);
                navigate("/");
            } else {
                setMessage(data.message || "Ошибка входа");
            }
        } catch (error) {
            setMessage("Ошибка подключения к серверу");
        } finally {
            setLoading(false);
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
