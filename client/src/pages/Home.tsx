import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { IStudent } from "../types";
import "../styles.css";
import { studentStore } from "../stores/StudentStore";
import userStore from "../stores/UserStore";

const Home: React.FC = observer(() => {
    const { students, message, fetchStudents, editStudent, deleteStudent, addStudent } = studentStore;
    const { isAuth } = userStore;

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

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IStudent) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IStudent) => {
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

    const handleSave = (id: number) => {
        editStudent(id, editedData);
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
    };

    const handleCancel = () => {
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
    };

    const handleDelete = (id: number) => {
        deleteStudent(id);
    };

    const handleAddStudent = () => {
        addStudent(newStudent);
        setNewStudent({ fio: "", group: "", enter_year: 0 });
        setIsAddingNew(false);
    };

    const handleCancelAdd = () => {
        setNewStudent({ fio: "", group: "", enter_year: 0 });
        setIsAddingNew(false);
    };

    const renderAddRow = () => {
        if (!isAddingNew) return null;

        return (
            <tr>
                <td>
                    <input
                        type="text"
                        value={newStudent.fio}
                        onChange={(e) => handleNewStudentChange(e, "fio")}
                        placeholder="ФИО"
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={newStudent.group}
                        onChange={(e) => handleNewStudentChange(e, "group")}
                        placeholder="Группа"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={newStudent.enter_year}
                        onChange={(e) => handleNewStudentChange(e, "enter_year")}
                        placeholder="Год поступления"
                    />
                </td>
                <td>
                    <button onClick={handleAddStudent}>Сохранить</button>
                    <button onClick={handleCancelAdd}>Отмена</button>
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
                        <th>ФИО</th>
                        <th>Группа</th>
                        <th>Год поступления</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>
                                {editingStudent === student.id ? (
                                    <input
                                        type="text"
                                        value={editedData.fio}
                                        onChange={(e) => handleChange(e, "fio")}
                                    />
                                ) : (
                                    <Link to={`/grades/${student.id}`} style={{ textDecoration: "underline" }}>
                                        {student.fio}
                                    </Link>
                                )}
                            </td>
                            <td>
                                {editingStudent === student.id ? (
                                    <input
                                        type="text"
                                        value={editedData.group}
                                        onChange={(e) => handleChange(e, "group")}
                                    />
                                ) : (
                                    student.group
                                )}
                            </td>
                            <td>
                                {editingStudent === student.id ? (
                                    <input
                                        type="number"
                                        value={editedData.enter_year}
                                        onChange={(e) => handleChange(e, "enter_year")}
                                    />
                                ) : (
                                    student.enter_year
                                )}
                            </td>
                            <td>
                                {isAuth ? (editingStudent === student.id ? (
                                    <>
                                        <button onClick={() => handleSave(student.id)}>Сохранить</button>
                                        <button onClick={handleCancel}>Отмена</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(student)}>✏️</button>
                                        <button onClick={() => handleDelete(student.id)}>❌</button>
                                    </>
                                )) : null}
                            </td>
                        </tr>
                    ))}
                    {renderAddRow()}
                </tbody>
            </table>

            {!isAddingNew && isAuth && (
                <button onClick={() => setIsAddingNew(true)} style={{ marginTop: "20px" }}>
                    Добавить студента
                </button>
            )}

            {message && <div>{message}</div>}
        </div>
    );
});

export default Home;
