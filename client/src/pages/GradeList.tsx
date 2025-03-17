import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import { AuthProps } from "../types";
import "../styles.css";
import gradeStore from "../store/GradeStore";

const GradeList: React.FC<AuthProps> = observer(({ isAuth, setisauth }) => {
    const { id } = useParams<{ id?: string }>();
    const selectedStudentId = id ? parseInt(id, 10) : null;

    useEffect(() => {
        gradeStore.fetchGrades();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Header isAuth={isAuth} setisauth={setisauth} />
            <h1 style={{ fontWeight: "bold" }}>Список оценок</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "10px" }}>Студент</th>
                        {gradeStore.subjects.map(subject => (
                            <th key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                {subject.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {gradeStore.students.map(student => (
                        <tr
                            key={student.id}
                            style={{
                                backgroundColor: student.id === selectedStudentId ? "#3399ff" : "transparent",
                                color: student.id === selectedStudentId ? "white" : "black",
                            }}
                        >
                            <td style={{ border: "1px solid black", padding: "10px" }}>{student.fio}</td>
                            {gradeStore.subjects.map(subject => {
                                const inputValue = gradeStore.getGradeValue(student.id, subject.id);
                                return (
                                    <td key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                        <input
                                            type="number"
                                            max="5"
                                            min="1"
                                            value={inputValue}
                                            onChange={e => gradeStore.handleGradeChange(student.id, subject.id, e.target.value)}
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
            {isAuth && (
                <button
                    onClick={gradeStore.saveChanges}
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
            )}
            <div>{gradeStore.message}</div>
        </div>
    );
});

export default GradeList;