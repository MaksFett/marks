import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../store/UserStore";

const Login = observer(() => {
    const { login, password, message, setLogin, setPassword, setMessage, loginUser } = userStore;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser();
        if (userStore.isAuth) {
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
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                disabled={!isFormValid}
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
            {message !== "" ? <div>{message}</div> : <div>&nbsp;</div>}
        </form>
    );
});

export default Login;
