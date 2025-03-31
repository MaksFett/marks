import React, { useEffect } from "react";
import { useGetUserQuery } from "../store/slices/userApiSlice";

import Header from "../components/Header";

const Profile: React.FC = () => {
    const { data: user, isLoading } = useGetUserQuery();

    useEffect(() => {
        console.log(user);
    }, [user])

    if (isLoading) return <div>Загрузка...</div> 

    if (!user) return null
    
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
