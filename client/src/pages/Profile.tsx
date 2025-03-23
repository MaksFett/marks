import React, { useEffect, useState } from "react";
import axios from "axios";
import { IUser, AuthProps } from "../types";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Profile: React.FC<AuthProps> = ({isAuth, setisauth}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/user_api/users/get_user", { withCredentials: true, headers: { "Authorization": "Bearer " + localStorage.getItem("access-token")}})
            .then((response) => setUser(response.data.user as IUser))
            .catch(() => navigate('/login'));
    }, []);

    if (!user) return null; 

    return (
        <div>
            <Header isAuth={isAuth} setisauth={setisauth}/>
            <h1>Личный кабинет</h1>
            <p><strong>Здравствуйте,</strong> {user.login}</p>
            <p><strong>Ваш Email:</strong> {user.email}</p>
        </div>
    );
};

export default Profile;
