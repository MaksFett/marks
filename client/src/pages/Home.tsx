import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { IStudent } from "../types";
import { userStore } from "../store/UserStore";
import "../styles.css";
import axios from "axios";

const Home: React.FC = observer(() => {
    const { students, isAuth, setStudents, fetchStudents } = userStore;

    const [editingStudent, setEditingStudent] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<Omit<IStudent, "id">>({
        fio: "",
        group: "",
        enter_year: 0,
    });

    const [newStudent, setNewStudent] = useState<Omit<IStudent, "id">>({
        fio: "",
        group: "",
        enter_year: 0,
    });

    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        fetchStudents(); // MobX загружает студентов
    }, [fetchStudents]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setNewStudent({ ...newStudent, [field]: e.target.value });
    };

    const handleEdit = (student: IStudent) => {
        setEditingStudent(student.id);
        setEditedData({
            fio: student.fio,
            group: student.group,
            enter_year: student.enter_year,
        });
    };

    const handleSave = async (id: number) => {
        try {
            await axios.post("/main_api/students/edit_student", { id, ...editedData });
            setStudents(
                students.map((student) =>
                    student.id === id ? { ...student, ...editedData, enter_year: Number(editedData.enter_year) } : student
                )
            );
            setMessage("Изменения сохранены");
        } catch (error) {
            setMessage("Ошибка при сохранении");
        }
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
    };

    const handleCancel = () => {
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.post("/main_api/students/delete_student", { id });
            setStudents(students.filter((student) => student.id !== id));
            setMessage("Студент удалён");
        } catch (error) {
            setMessage("Ошибка при удалении");
        }
    };

    const handleAddStudent = async () => {
        try {
            const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
            const studentToAdd = { id: newId, fio: newStudent.fio, group: newStudent.group, enter_year: Number(newStudent.enter_year) };

            await axios.post("/main_api/students/add_student", studentToAdd);
            setStudents([...students, studentToAdd]);
            setMessage("Студент добавлен");
        } catch (error) {
            setMessage("Ошибка при добавлении");
        }

        setNewStudent({ fio: "", group: "", enter_year: 0 });
        setIsAddingNew(false);
    };

    const handleCancelAdd = () => {
        setNewStudent({ fio: "", group: "", enter_year: 0 });
        setIsAddingNew(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <Header />
            <h1 style={{ textAlign: "center" }}>Список студентов</h1>
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
                            <td>
                                {editingStudent === student.id ? (
                                    <input type="text" value={editedData.fio} onChange={(e) => handleChange(e, "fio")} />
                                ) : (
                                    <Link to={`/grades/${student.id}`}>{student.fio}</Link>
                                )}
                            </td>
                            <td>
                                {editingStudent === student.id ? (
                                    <input type="text" value={editedData.group} onChange={(e) => handleChange(e, "group")} />
                                ) : (
                                    student.group
                                )}
                            </td>
                            <td>
                                {editingStudent === student.id ? (
                                    <input type="number" value={editedData.enter_year} onChange={(e) => handleChange(e, "enter_year")} />
                                ) : (
                                    student.enter_year
                                )}
                            </td>
                            <td>
                                {isAuth && (editingStudent === student.id ? (
                                    <>
                                        <button onClick={() => handleSave(student.id)}>Сохранить</button>
                                        <button onClick={handleCancel}>Отмена</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(student)}>✏️</button>
                                        <button onClick={() => handleDelete(student.id)}>❌</button>
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                    {isAddingNew && (
                        <tr>
                            <td><input type="text" value={newStudent.fio} onChange={(e) => handleNewStudentChange(e, "fio")} placeholder="ФИО" /></td>
                            <td><input type="text" value={newStudent.group} onChange={(e) => handleNewStudentChange(e, "group")} placeholder="Группа" /></td>
                            <td><input type="number" value={newStudent.enter_year} onChange={(e) => handleNewStudentChange(e, "enter_year")} placeholder="Год поступления" /></td>
                            <td>
                                <button onClick={handleAddStudent}>Сохранить</button>
                                <button onClick={handleCancelAdd}>Отмена</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {isAuth && !isAddingNew && (
                <button onClick={() => setIsAddingNew(true)}>Добавить студента</button>
            )}
            {message && <p>{message}</p>}
        </div>
    );
});

export default Home;
