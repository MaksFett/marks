import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/user_api/users", { login, password, email });
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации", error);
    }
  };

  // Проверка email при изменении значения
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Проверка email по шаблону
    if (e.target.validity.valid || value === "") {
      setEmailError("");
    } else {
      setEmailError("Неверный формат email. Обязательно наличие символа @.");
    }
  };

  // Проверка, что форма валидна (все поля заполнены, email корректен)
  const isFormValid = login && email && password && !emailError;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      
      <input
        type="text"
        placeholder="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      
      {/* Оборачиваем email в контейнер для позиционирования выпадающего списка */}
      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          required
          pattern="^[^@]+@[^@]+$"
          ref={emailRef}
        />
        {/* Если поле в фокусе и есть ошибка, выводим dropdown с сообщением */}
        {isEmailFocused && emailError && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "110px",  // Сдвигаем на 10px вправо
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
        Зарегистрироваться
      </button>
      
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </form>
  );
};

export default Register;
