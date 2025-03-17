import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../stores/AuthStore";
import * as Yup from "yup";
import { IUser } from "../types";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { login, email, password, message, isLoading, setLogin, setEmail, setPassword, registerUser, clearMessage } = authStore;

    // Валидация формы
    const validationSchema = Yup.object({
        login: Yup.string().required("Логин обязателен"),
        email: Yup.string()
            .email("Неверный формат email")
            .required("Email обязателен"),
        password: Yup.string()
            .min(6, "Пароль должен содержать минимум 6 символов")
            .required("Пароль обязателен"),
    });

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isSuccess = await registerUser();
        if (isSuccess) {
            navigate("/");
        }
    };

    const isFormValid = login && email && password && !isLoading;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Регистрация</h2>

            <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => {
                    setLogin(e.target.value);
                    clearMessage();
                }}
            />
            {!login && <div style={{ color: "red" }}>Логин обязателен</div>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    clearMessage();
                }}
            />
            {!email && <div style={{ color: "red" }}>Email обязателен</div>}

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessage();
                }}
            />
            {!password && <div style={{ color: "red" }}>Пароль обязателен</div>}

            <button
                type="submit"
                disabled={!isFormValid}
                style={{
                    backgroundColor: isFormValid ? "#007bff" : "#ccc",
                    cursor: isFormValid ? "pointer" : "not-allowed",
                }}
            >
                Зарегистрироваться
            </button>

            <p>
                Уже есть аккаунт? <Link to="/login">Войдите</Link>
            </p>
            {message && <div>{message}</div>}
        </form>
    );
};

export default observer(Register);
