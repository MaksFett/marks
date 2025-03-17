import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IUser } from "../types";
import { observer } from "mobx-react-lite";
import { userStore } from "../store/UserStore";  // Импортируем хранилище

const Register: React.FC = observer(() => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");

    const validationSchema = Yup.object({
        login: Yup.string().required("Логин обязателен"),
        email: Yup.string()
            .email("Неверный формат email")
            .required("Email обязателен"),
        password: Yup.string()
            .min(6, "Пароль должен содержать минимум 6 символов")
            .required("Пароль обязателен"),
    });

    const formik = useFormik({
        initialValues: {
            login: "",
            email: "",
            password: "",
        },
        validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values: IUser) => {
            await userStore.registerUser(values); // Используем MobX для регистрации
            if (!userStore.message) {
                navigate("/");  // Переход на главную страницу, если нет ошибок
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Регистрация</h2>

            <input
                type="text"
                name="login"
                placeholder="Логин"
                value={formik.values.login}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.login && formik.errors.login && <div style={{ color: "red" }}>{formik.errors.login}</div>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}

            <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <div style={{ color: "red" }}>{formik.errors.password}</div>}

            <button type="submit" disabled={!(formik.isValid && formik.dirty)} style={{
                backgroundColor: formik.isValid && formik.dirty ? "#007bff" : "#ccc",
                cursor: formik.isValid && formik.dirty ? "pointer" : "not-allowed",
            }}>
                Зарегистрироваться
            </button>

            <p>
                Уже есть аккаунт? <Link to="/login">Войдите</Link>
            </p>
            {userStore.message && <div style={{ color: "red" }}>{userStore.message}</div>}  {/* Отображаем сообщение об ошибке из MobX */}
        </form>
    );
});

export default Register;
