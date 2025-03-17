import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../stores/AuthStore";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, password, message, isLoading, setLogin, setPassword, loginUser, clearMessage } = authStore;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isSuccess = await loginUser();
        if (isSuccess) {
            navigate("/");
        }
    };

    // Проверяем, что форма валидна (поля заполнены)
    const isFormValid = login && password;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => {
                    setLogin(e.target.value);
                    clearMessage(); // очищаем сообщение при изменении данных
                }}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessage(); // очищаем сообщение при изменении данных
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
                Войти
            </button>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
            </p>
            {message && <div>{message}</div>}
        </form>
    );
};

export default observer(Login);
