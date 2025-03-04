import React from "react";
import { IUser } from "types.ts"; // Импортируем наш интерфейс

interface UserProps {
    user: IUser;
}

const User: React.FC<UserProps> = ({ user }) => {
    return (
        <div>
            <p>Логин: {user.login}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default User;
