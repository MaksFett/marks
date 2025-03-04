import React, { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../types";
import Header from "../components/Header";
import "../styles.css";

const Home: React.FC = () => {
    const [students, setStudents] = useState<IUser[]>([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/students")
            .then((response) => setStudents(response.data))
            .catch((error) => console.error("Ошибка загрузки студентов:", error));
    }, []);

    return (
        <div>
            <Header />
            <h1 style={{ fontWeight: 'bold' }}>О нас</h1>
            <p>
                Добро пожаловать в систему мониторинга успеваемости студентов! 
                Наше приложение предоставляет удобный интерфейс для студентов, 
                преподавателей и администраторов, позволяя отслеживать и анализировать 
                успеваемость студентов, а также управлять данными о них.
            </p>
            <h2 style={{ fontWeight: 'bold' }}>Список студентов</h2>
            <p>Ниже приведен список студентов, которые зарегистрированы в системе:</p>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        {student.login} ({student.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
