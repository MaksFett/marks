import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../stores/Register";
import * as Yup from "yup";
import { authStore } from "../stores/Register"; // MobX store

const Register: React.FC = () => {
    const navigate = useNavigate();
    const {
        setLogin,
        setEmail,
        setPassword,
        registerUser,
        message,
        clearMessage,
        isLoading,
    } = authStore;

    const validationSchema = Yup.object({
        login: Yup.string().required("Логин обязателен"),
        email: Yup.string().email("Неверный формат email").required("Email обязателен"),
        password: Yup.string().min(6, "Минимум 6 символов").required("Пароль обязателен"),
    });

    const formik = useFormik({
        initialValues: {
            login: "",
            email: "",
            password: "",
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            setLogin(values.login);
            setEmail(values.email);
            setPassword(values.password);
            const success = await registerUser();
            if (success) navigate("/");
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
                onChange={(e) => {
                    formik.handleChange(e);
                    clearMessage();
                }}
                onBlur={formik.handleBlur}
            />
            {formik.touched.login && formik.errors.login && <div style={{ color: "red" }}>{formik.errors.login}</div>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={(e) => {
                    formik.handleChange(e);
                    clearMessage();
                }}
                onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}

            <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formik.values.password}
                onChange={(e) => {
                    formik.handleChange(e);
                    clearMessage();
                }}
                onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <div style={{ color: "red" }}>{formik.errors.password}</div>}

            <button
                type="submit"
                disabled={!(formik.isValid && formik.dirty) || isLoading}
                style={{
                    backgroundColor: formik.isValid && formik.dirty ? "#007bff" : "#ccc",
                    cursor: formik.isValid && formik.dirty ? "pointer" : "not-allowed",
                }}
            >
                {isLoading ? "Загрузка..." : "Зарегистрироваться"}
            </button>

            <p>
                Уже есть аккаунт? <Link to="/login">Войдите</Link>
            </p>
            {message && <div>{message}</div>}
        </form>
    );
};

export default observer(Register);
