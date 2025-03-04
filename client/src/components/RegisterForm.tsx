import React, { useState, useRef } from "react";

const RegisterForm: React.FC = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ login, email, password });
  };

  // Форма считается валидной, если все поля заполнены и email соответствует шаблону
  const isFormValid = login && email && password && !emailError;

  // Обработчик изменения email с использованием встроенной проверки (HTML5)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Используем встроенную проверку валидности по атрибуту pattern и type="email"
    if (e.target.validity.valid || value === "") {
      setEmailError("");
    } else {
      setEmailError("Неверный формат email. Обязательно наличие символа @, а до и после него должны быть данные.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          // Шаблон, гарантирующий наличие хотя бы одного символа до и после @
          pattern="^[^@]+@[^@]+$"
          ref={emailRef}
        />
        {/* Если поле в фокусе и есть ошибка, выводим dropdown с сообщением */}
        {isEmailFocused && emailError && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
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
    </form>
  );
};

export default RegisterForm;
