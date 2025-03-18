import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { AuthProps, ISubject, IGrade, IShortStudent } from "../types";
import "../styles.css";
import { useGetMarksQuery, useUpdateMarkMutation } from "../store/mainApiSlice";

const GradeList: React.FC<AuthProps> = ({isAuth, setisauth}) => {
    const { id } = useParams<{ id?: string }>();
    const selectedStudentId = id ? parseInt(id, 10) : null;

    const [students, setStudents] = useState<Array<IShortStudent>>([]);

    const [subjects, setSubjects] = useState<Array<ISubject>>([]);

    const {data: query_grades, isLoading} = useGetMarksQuery();
    const [updateMarks] = useUpdateMarkMutation();
    const [grades, setGrades] = useState<Array<IGrade>>([]);
    const [editedGrades, setEditedGrades] = useState<{ [key: string]: string }>({});

    const [message, setMessage] = useState<string>("");

    /*useEffect(() => {
        axios.get('/main_api/marks/get_marks')
            .then((response) => {
                setStudents(response.data.students);
                setSubjects(response.data.subjects);
                setGrades(response.data.marks);
            })
            .catch((error) => {
                console.log(error.message);
                setMessage("Неизвестная ошибка")
            })
    }, [])*/
    useEffect(() => {
        if (query_grades) {
            setGrades(query_grades.marks);
            setStudents(query_grades.students);
            setSubjects(query_grades.subjects);
        }
    }, [query_grades])

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
        const new_grades = Object.entries(editedGrades).map((g) => new Object({"student_id": Number(g[0].split('-')[0]),"subject_id": Number(g[0].split('-')[1]), "value": Number(g[1])}))
        updateMarks(new_grades as Array<IGrade>).unwrap()
            .then((response) => setMessage(response.message))
            .catch((error) => {console.log(error.message); setMessage("Неизвестная ошибка"); return});
        setGrades(prevGrades =>
            prevGrades.map(g =>
                editedGrades[`${g.student_id}-${g.subject_id}`] !== undefined
                    ? { ...g, value: Number(editedGrades[`${g.student_id}-${g.subject_id}`]) }
                    : g
            )
        );
        setEditedGrades({});
    };

    if (isLoading) return <div>Загрузка...</div> 

    return (
        <div style={{ padding: "20px" }}>
            <Header isAuth={isAuth} setisauth={setisauth} />
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
                            <td style={{ border: "1px solid black", padding: "10px" }}>{student.fio}</td>
                            {subjects.map(subject => {
                                const grade = grades.find(g => g.student_id === student.id && g.subject_id === subject.id);
                                const inputValue =
                                    editedGrades[`${student.id}-${subject.id}`] !== undefined
                                        ? editedGrades[`${student.id}-${subject.id}`]
                                        : grade?.value ?? "-";

                                return (
                                    <td key={subject.id} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                                        <input
                                            type="number"
                                            max="5"
                                            min="1"
                                            value={inputValue}
                                            onChange={e => handleGradeChange(student.id, subject.id, e.target.value)}
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
};

export default GradeList;
