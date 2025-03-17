import React, { useEffect } from "react";
import { observer } from "mobx-react-lite"; // Оборачивание компонента в observer
import { useNavigate } from "react-router-dom";
import userStore from "../stores/UserStore"; 
import Header from "../components/Header";

const Profile: React.FC = observer(() => {
    const { user, isAuth, fetchUser } = userStore; // Извлекаем состояние из store
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser(); 
            if (!isAuth) {
                navigate("/login"); // Если пользователь не авторизован, перенаправляем на страницу входа
            }
        };
        loadUser();
    }, [isAuth, fetchUser, navigate]);

    if (!user) return <div>Загрузка...</div>; 

    return (
        <div>
            <Header isAuth={isAuth} setisauth={userStore.logout} />
            <h1>Личный кабинет</h1>
            <p><strong>Здравствуйте,</strong> {user.login}</p>
            <p><strong>Ваш Email:</strong> {user.email}</p>
        </div>
    );
});

export default Profile;
