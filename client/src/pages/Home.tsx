import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles.css";

const Home: React.FC = () => {
    const [students, setStudents] = useState([
        { id: 1, fullName: "Иванов Иван Иванович", group: "МК8-81Б", year: 2021 },
        { id: 2, fullName: "Петров Петр Петрович", group: "ИУК2-22Б", year: 2022 },
        { id: 3, fullName: "Сидоров Сидор Сидорович", group: "ИУК4-41Б", year: 2023 },
    ]);

    const [editingStudent, setEditingStudent] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<{ fullName: string; group: string; year: string }>({
        fullName: "",
        group: "",
        year: "",
    });

    const [newStudent, setNewStudent] = useState<{ fullName: string; group: string; year: string }>({
        fullName: "",
        group: "",
        year: "",
    });

    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // Флаг для добавления нового студента

    // Изменение значения в ячейке
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setEditedData({ ...editedData, [field]: e.target.value });
        console.log(`Изменено поле ${field}: ${e.target.value}`); // Лог изменений
    };

    // Изменение значения для нового студента
    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setNewStudent({ ...newStudent, [field]: e.target.value });
    };

    // Редактирование студента
    const handleEdit = (student: any) => {
        setEditingStudent(student.id);
        setEditedData({
            fullName: student.fullName,
            group: student.group,
            year: String(student.year),
        });
        console.log(`Начато редактирование студента с ID: ${student.id}`);
    };

    // Сохранение изменений
    const handleSave = (id: number) => {
        setStudents(
            students.map((student) =>
                student.id === id
                    ? { ...student, ...editedData, year: Number(editedData.year) }
                    : student
            )
        );
        setEditingStudent(null);
        setEditedData({ fullName: "", group: "", year: "" });
        console.log(`Изменения сохранены для студента с ID: ${id}`);
    };

    // Отмена редактирования
    const handleCancel = () => {
        setEditingStudent(null);
        setEditedData({ fullName: "", group: "", year: "" });
        console.log("Редактирование отменено");
    };

    // Удаление студента
    const handleDelete = (id: number) => {
        setStudents(students.filter((student) => student.id !== id));
        console.log(`Студент с ID: ${id} удален`);
    };

    // Добавление нового студента
    const handleAddStudent = () => {
        const newId = students.length > 0 ? Math.max(...students.map((student) => student.id)) + 1 : 1;
        const studentToAdd = {
            id: newId,
            fullName: newStudent.fullName,
            group: newStudent.group,
            year: Number(newStudent.year),
        };
        setStudents([...students, studentToAdd]);
        setNewStudent({ fullName: "", group: "", year: "" });
        setIsAddingNew(false); // Закрытие строки добавления
        console.log(`Добавлен новый студент: ${studentToAdd.fullName}`);
    };

    // Отмена добавления нового студента
    const handleCancelAdd = () => {
        setNewStudent({ fullName: "", group: "", year: "" });
        setIsAddingNew(false); // Закрытие строки добавления
        console.log("Добавление студента отменено");
    };

    // Отображение пустой строки для добавления студента
    const renderAddRow = () => {
        if (!isAddingNew) return null;

        return (
            <tr>
                <td>
                    <input
                        type="text"
                        value={newStudent.fullName}
                        onChange={(e) => handleNewStudentChange(e, "fullName")}
                        placeholder="ФИО"
                        style={{ width: "100%" }}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={newStudent.group}
                        onChange={(e) => handleNewStudentChange(e, "group")}
                        placeholder="Группа"
                        style={{ width: "100%" }}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={newStudent.year}
                        onChange={(e) => handleNewStudentChange(e, "year")}
                        placeholder="Год поступления"
                        style={{ width: "100%" }}
                    />
                </td>
                <td>
                    <button onClick={handleAddStudent} style={{ padding: "5px 10px", cursor: "pointer", marginBottom: "10px", marginTop: "10px"}}>
                        Сохранить
                    </button>
                    <button onClick={handleCancelAdd} style={{ padding: "5px 10px", cursor: "pointer" }}>
                        Отмена
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <Header />
            <h1 style={{ fontWeight: "bold", textAlign: "center" }}>Список студентов</h1>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "10px" }}>ФИО</th>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Группа</th>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Год поступления</th>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td style={{ border: "1px solid black", padding: "10px" }}>
                                {editingStudent === student.id ? (
                                    <input
                                        type="text"
                                        value={editedData.fullName}
                                        onChange={(e) => handleChange(e, "fullName")}
                                        style={{ width: "100%" }}
                                    />
                                ) : (
                                    <Link to={`/grades/${student.id}`} style={{ textDecoration: "underline", color: "black" }}>
                                        {student.fullName}
                                    </Link>
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {editingStudent === student.id ? (
                                    <input
                                        type="text"
                                        value={editedData.group}
                                        onChange={(e) => handleChange(e, "group")}
                                        style={{ textAlign: "center", width: "100%" }}
                                    />
                                ) : (
                                    student.group
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {editingStudent === student.id ? (
                                    <input
                                        type="number"
                                        value={editedData.year}
                                        onChange={(e) => handleChange(e, "year")}
                                        style={{ textAlign: "center", width: "100%" }}
                                    />
                                ) : (
                                    student.year
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {editingStudent === student.id ? (
                                    <>
                                        <button
                                            onClick={() => handleSave(student.id)}
                                            style={{
                                                marginRight: "15px",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                marginBottom: "10px", 
                                                marginTop: "10px",
                                                marginLeft: "20px"
                                            }}
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            style={{
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(student)} style={{ marginRight: "5px" }}>
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(student.id)} style={{ marginLeft: "5px" }}>
                                            ❌
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {renderAddRow()}
                </tbody>
            </table>

            {/* Кнопка для добавления нового студента */}
            {!isAddingNew && (
                <button onClick={() => setIsAddingNew(true)} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
                    Добавить студента
                </button>
            )}
        </div>
    );
};

export default Home;
