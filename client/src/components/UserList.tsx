import React from "react";
import User from "./User";
import { IUser } from "../types"; // Используем интерфейс

interface UserListProps {
    users: IUser[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    return (
        <div className="user-list">
            <h2>Список пользователей</h2>
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.id} className="user-card">
                        <p><strong>Логин:</strong> {user.login}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                ))
            ) : (
                <p>Пользователей нет</p>
            )}
        </div>
    );
};


export default UserList;
