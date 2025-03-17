import { observer } from "mobx-react-lite";
import { userStore } from "../store/UserStore";
import { useEffect } from "react";

const Profile = observer(() => {
    useEffect(() => {
        userStore.fetchUser();
    }, []);

    if (userStore.isLoading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h1>Профиль</h1>
            {userStore.user ? (
                <>
                    <p>Имя: {userStore.user.name}</p>
                    <p>Email: {userStore.user.email}</p>
                </>
            ) : (
                <p>Нет данных о пользователе</p>
            )}
        </div>
    );
});

export default Profile;
