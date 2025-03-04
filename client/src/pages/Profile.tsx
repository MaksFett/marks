import React, { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../types";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Profile: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/me", { withCredentials: true })
            .then((response) => setUser(response.data))
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        if (!user) {
            // Если нет пользователя, перенаправляем на страницу регистрации
            navigate("/register");
        }
    }, [user, navigate]);

    if (!user) return null; 

    return (
        <div>
            <Header />
            <h1>Личный кабинет</h1>
            <p><strong>Здравствуйте,</strong> {user.login}</p>
            <p><strong>Ваш Email:</strong> {user.email}</p>
        </div>
    );
};

export default Profile;
