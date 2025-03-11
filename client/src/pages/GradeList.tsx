import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles.css";

const GradeList: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const selectedStudentId = id ? parseInt(id, 10) : null;

    const students = [
        { id: 1, name: "Иванов И.И." },
        { id: 2, name: "Петров П.П." },
        { id: 3, name: "Сидоров С.С." },
    ];

    const subjects = [
        { id: 1, name: "Математический анализ" },
        { id: 2, name: "Технологии обработки больших данных" },
        { id: 3, name: "Системное программирование" },
    ];

    const initialGrades = [
        { studentId: 1, subjectId: 1, grade: 4 },
        { studentId: 1, subjectId: 2, grade: 5 },
        { studentId: 1, subjectId: 3, grade: 3 },
        { studentId: 2, subjectId: 1, grade: 5 },
        { studentId: 2, subjectId: 2, grade: 4 },
        { studentId: 2, subjectId: 3, grade: 5 },
        { studentId: 3, subjectId: 1, grade: 3 },
        { studentId: 3, subjectId: 2, grade: 3 },
        { studentId: 3, subjectId: 3, grade: 4 },
    ];

    const [grades, setGrades] = useState(initialGrades);
    const [editedGrades, setEditedGrades] = useState<{ [key: string]: string }>({});

    // Функция обновления значения в input
    const handleGradeChange = (studentId: number, subjectId: number, value: string) => {
        setEditedGrades(prev => ({
            ...prev,
            [`${studentId}-${subjectId}`]: value,
        }));
    };

    // Функция сохранения изменений
    const saveChanges = () => {
        console.log("Изменённые оценки:", editedGrades);
        setGrades(prevGrades =>
            prevGrades.map(g =>
                editedGrades[`${g.studentId}-${g.subjectId}`] !== undefined
                    ? { ...g, grade: Number(editedGrades[`${g.studentId}-${g.subjectId}`]) }
                    : g
            )
        );
        setEditedGrades({});
    };

    return (
        <div style={{ padding: "20px" }}>
            <Header />
            <h1 style={{ fontWeight: "bold" }}>Список оценок</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Студент</th>
                        {subjects.map(subject => (
                            <th key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {subject.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr
                            key={student.id}
                            style={{
                                backgroundColor: student.id === selectedStudentId ? "#3399ff" : "transparent",
                                color: student.id === selectedStudentId ? "white" : "black",
                            }}
                        >
                            <td style={{ border: "1px solid black", padding: "10px" }}>{student.name}</td>
                            {subjects.map(subject => {
                                const grade = grades.find(g => g.studentId === student.id && g.subjectId === subject.id);
                                const inputValue =
                                    editedGrades[`${student.id}-${subject.id}`] !== undefined
                                        ? editedGrades[`${student.id}-${subject.id}`]
                                        : grade?.grade ?? "-";

                                return (
                                    <td key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={e => handleGradeChange(student.id, subject.id, e.target.value)}
                                            style={{
                                                width: "50px",
                                                textAlign: "center",
                                                border: "1px solid gray",
                                                borderRadius: "4px",
                                                padding: "5px",
                                            }}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={saveChanges}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                Сохранить изменения
            </button>
        </div>
    );
};

export default GradeList;
