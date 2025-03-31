import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/UserStore";
import Header from "../components/Header";
import { AuthProps } from "../types";

const Profile: React.FC<AuthProps> = observer(() => {
    const { user, isAuth, fetchUser } = userStore;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser(); 
    }, [isAuth, fetchUser, navigate]);

    if (!user) return null;

    return (
        <div>
            <Header />
            <h1>Личный кабинет</h1>
            <p><strong>Здравствуйте,</strong> {user.login}</p>
            <p><strong>Ваш Email:</strong> {user.email}</p>
        </div>
    );
});

export default Profile;
