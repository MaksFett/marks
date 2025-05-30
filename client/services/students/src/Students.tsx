import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IStudent } from "@packages/shared/src/types";
import "@packages/shared/src/styles.css";
import { useSelector } from "react-redux";
import { selectIsAuth } from "@packages/shared/src/store/slices/authSlice";
import { useGetStudentsQuery, useAddStudentMutation, useEditStudentMutation, useDeleteStudentMutation } from "@packages/shared/src/store/slices/studentApiSlice";

const Students: React.FC = () => {
    const isAuth = useSelector(selectIsAuth);
    const {data: query_students, isLoading} = useGetStudentsQuery();
    const [students, setStudents] = useState<Array<IStudent>>([]);
    const [addStudent] = useAddStudentMutation();
    const [editStudent] = useEditStudentMutation();
    const [deleteStudent] = useDeleteStudentMutation();
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

    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // Флаг для добавления нового студента
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (query_students) setStudents(query_students);
    }, [query_students])

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
            fio: student.fio,
            group: student.group,
            enter_year: student.enter_year,
        });
        console.log(`Начато редактирование студента с ID: ${student.id}`);
    };

    // Сохранение изменений
    const handleSave = (id: number) => {
        setStudents(
            students.map((student) =>
                student.id === id
                    ? { ...student, ...editedData, enter_year: Number(editedData.enter_year) }
                    : student
            )
        );
        editStudent({id: id, ...editedData}).unwrap()
            .then((response) => {setMessage(response.message)})
            .catch((error) => {console.log(error.message); setMessage("Неизвестная ошибка")});
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
        console.log(`Изменения сохранены для студента с ID: ${id}`);
    };

    // Отмена редактирования
    const handleCancel = () => {
        setEditingStudent(null);
        setEditedData({ fio: "", group: "", enter_year: 0 });
        console.log("Редактирование отменено");
    };

    // Удаление студента
    const handleDelete = (id: number) => {
        deleteStudent({"id": id}).unwrap()
            .then((response) => {setMessage(response.message)})
            .catch((error) => {console.log(error.message); setMessage("Неизвестная ошибка")})
        setStudents(students.filter((student) => student.id !== id));
        console.log(`Студент с ID: ${id} удален`);
    };

    // Добавление нового студента
    const handleAddStudent = () => {
        const newId = students.length > 0 ? Math.max(...students.map((student) => student.id)) + 1 : 1;
        const studentToAdd = {
            id: newId,
            fio: newStudent.fio,
            group: newStudent.group,
            enter_year: Number(newStudent.enter_year),
        };
        setStudents([...students, studentToAdd]);
        addStudent(newStudent).unwrap()
            .then((response) => setMessage(response.message))
            .catch((error) => {console.log(error.message); setMessage("Неизвестная ошибка")});
        setNewStudent({ fio: "", group: "", enter_year: 0 });
        setIsAddingNew(false); // Закрытие строки добавления
        console.log(`Добавлен новый студент: ${studentToAdd.fio}`);
    };

    // Отмена добавления нового студента
    const handleCancelAdd = () => {
        setNewStudent({ fio: "", group: "", enter_year: 0 });
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

    if (isLoading) return <div>Загрузка...</div> 

    return (
        <div>
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
                                        style={{ width: "100%" }}
                                    />
                                ) : (
                                    <Link to={`/grades/${student.id}`} style={{ textDecoration: "underline", color: "black" }}>
                                        {student.fio}
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
                                        value={editedData.enter_year}
                                        onChange={(e) => handleChange(e, "enter_year")}
                                        style={{ textAlign: "center", width: "100%" }}
                                    />
                                ) : (
                                    student.enter_year
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
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

            {/* Кнопка для добавления нового студента */}
            {!isAddingNew && isAuth && (
                <button onClick={() => setIsAddingNew(true)} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
                    Добавить студента
                </button>
            )}

            {message !== "" ? <div>{message}</div> : <div>&nbsp;</div>}
        </div>
    );
};

export default Students;
