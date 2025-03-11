import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/user_api/login", { login, password });
            localStorage.setItem("token", response.data.token);
            navigate("/");
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
        </form>
    );
};

export default Login;
