import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { IStudent } from "../types";
import "../styles.css";
import { studentStore } from "../stores/StudentStore"; // Import the MobX store
import userStore from "../stores/UserStore";

const Home: React.FC = () => {
    const { students, message, isLoading, fetchStudents, editStudent, deleteStudent, addStudent } = studentStore;
    const { isAuth } = userStore;

    useEffect(() => {
        fetchStudents(); // Fetch students when the component is mounted
    }, [fetchStudents]);

    const [editingStudent, setEditingStudent] = React.useState<number | null>(null);
    const [editedData, setEditedData] = React.useState<Omit<IStudent, "id">>({
        fio: "",
        group: "",
        enter_year: 0,
    });

    const [newStudent, setNewStudent] = React.useState<Omit<IStudent, "id">>({
        fio: "",
        group: "",
        enter_year: 0,
    });

    const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);

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
                        value={newStudent.enter_year}
                        onChange={(e) => handleNewStudentChange(e, "enter_year")}
                        placeholder="Год поступления"
                        style={{ width: "100%" }}
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
                                        value={editedData.fio}
                                        onChange={(e) => handleChange(e, "fio")}
                                    />
                                ) : (
                                    <Link to={`/grades/${student.id}`} style={{ textDecoration: "underline" }}>
                                        {student.fio}
                                    </Link>
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px" }}>
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
                            <td style={{ border: "1px solid black", padding: "10px" }}>
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
                            <td style={{ border: "1px solid black", padding: "10px" }}>
                                {isAuth ? (editingStudent === student.id ? (
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
                                )) : <></>}
                            </td>
                        </tr>
                    ))}
                    {renderAddRow()}
                </tbody>
            </table>

            {!isAddingNew && isAuth && (
                <button onClick={() => setIsAddingNew(true)}>Добавить студента</button>
            )}

            {message && <div>{message}</div>}
        </div>
    );
};

export default observer(Home); // Use observer to make the component reactive to MobX store changes
