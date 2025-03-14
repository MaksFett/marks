import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IUser } from "../types";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("")

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
        validateOnBlur: true,  // <-- добавлено
        validateOnChange: true, 
        onSubmit: async (values: IUser) => {
            try {
                await axios.post("/user_api/users/register", values)
                    .then(() => navigate("/"))
                    .catch((error) => setMessage(error.response.data.message));
            } catch (error) {
                console.error("Ошибка регистрации", error);
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
            {message !== "" ? <div>{message}</div> : <div>&nbsp;</div>}
        </form>
    );
};

export default Register;
