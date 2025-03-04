import React, { useEffect, useState } from "react";
import axios from "axios";
import UserList from "./components/UserList";
import RegisterForm from "./components/RegisterForm";
import { IUser } from "./types";
import "./styles.css";

const App: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        axios.get("http://localhost:3000/user_api/users")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Ошибка загрузки пользователей:", error));
    }, []);

    return (
        <div className="container">
            <h1>Система мониторинга успеваемости студентов</h1>
            <RegisterForm />
            <UserList users={users} />
        </div>
    );
};

export default App;
