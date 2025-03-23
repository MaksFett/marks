import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/user_api/users/login", { login, password })
                .then((response) => {
                    localStorage.setItem("access-token", response.data.accessToken);
                    localStorage.setItem("refresh-token", response.data.refreshToken);
                    navigate("/");
                })
                .catch((error) => setMessage(error.response.status.message));
        } catch (error) {
            console.error("Ошибка входа", error);
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
};

export default Login;
