import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import GradeStore from "../stores/GradeStore";
import UserStore from "../stores/UserStore";
import "../styles.css";

const GradeList: React.FC = observer(() => {
    const { isAuth } = UserStore;
    const { id } = useParams<{ id?: string }>();
    const selectedStudentId = id ? parseInt(id, 10) : null;

    const [editedGrades, setEditedGrades] = useState<{ [key: string]: number }>({});
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        GradeStore.fetchGrades();
    }, []);

    const handleGradeChange = (studentId: number, subjectId: number, value: number) => {
        setEditedGrades(prev => ({
            ...prev,
            [`${studentId}-${subjectId}`]: value,
        }));
    };

    const saveChanges = async () => {
        const isSuccess = await GradeStore.saveGrades(editedGrades);
        if (isSuccess) {
            setMessage("Оценки успешно сохранены");
            setEditedGrades({});
        } else {
            setMessage("Ошибка при сохранении");
        }
    };
    

    return (
        <div style={{ padding: "20px" }}>
            <Header />
            <h1 style={{ fontWeight: "bold" }}>Список оценок</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Студент</th>
                        {GradeStore.subjects.map(subject => (
                            <th key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {subject.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {GradeStore.students.map(student => (
                        <tr
                            key={student.id}
                            style={{
                                backgroundColor: student.id === selectedStudentId ? "#3399ff" : "transparent",
                                color: student.id === selectedStudentId ? "white" : "black",
                            }}
                        >
                            <td style={{ border: "1px solid black", padding: "10px" }}>{student.fio}</td>
                            {GradeStore.subjects.map(subject => {
                                const grade = GradeStore.grades.find(
                                    g => g.student_id === student.id && g.subject_id === subject.id
                                );
                                const inputValue =
                                    editedGrades[`${student.id}-${subject.id}`] !== undefined
                                        ? editedGrades[`${student.id}-${subject.id}`]
                                        : grade?.value ?? "-";

                                return (
                                    <td key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={inputValue}
                                            onChange={e =>
                                                handleGradeChange(student.id, subject.id, Number(e.target.value))
                                            }
                                            style={{
                                                width: "100%",
                                                background: "none",
                                                textAlign: "center",
                                                border: "none",
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
            {isAuth && (<button
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
            </button>)}
            <div>{message}</div>
        </div>
    );
});

export default GradeList;
