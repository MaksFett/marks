import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user_api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Ошибка входа", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Проверка email по встроенной валидации
    if (e.target.validity.valid || value === "") {
      setEmailError("");
    } else {
      setEmailError("Неверный формат email. Обязательно наличие символа @, а до и после него должны быть данные.");
    }
  };

  // Форма валидна, если email и password заполнены и нет ошибки email
  const isFormValid = email && password && !emailError;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      {/* Оборачиваем поле email в контейнер для позиционирования выпадающего списка ошибок */}
      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          required
          pattern="^[^@]+@[^@]+$"
          ref={emailRef}
        />
        {isEmailFocused && emailError && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "110px", 
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "4px",
              zIndex: 10,
              minWidth: "250px"
            }}
          >
            {emailError}
          </div>
        )}
      </div>
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
