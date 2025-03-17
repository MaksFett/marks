import { makeAutoObservable } from "mobx";
import axios from "axios";
import { IShortStudent, ISubject, IGrade } from "../types";

class GradeStore {
    students: IShortStudent[] = [];
    subjects: ISubject[] = [];
    grades: IGrade[] = [];
    editedGrades: { [key: string]: string } = {};
    message: string = "";

    constructor() {
        makeAutoObservable(this);
        this.fetchGrades();
    }

    fetchGrades() {
        axios.get('/main_api/marks/get_marks')
            .then((response) => {
                this.students = response.data.students;
                this.subjects = response.data.subjects;
                this.grades = response.data.marks;
            })
            .catch(() => {
                this.message = "Неизвестная ошибка";
            });
    }

    handleGradeChange(studentId: number, subjectId: number, value: string) {
        this.editedGrades = {
            ...this.editedGrades,
            [`${studentId}-${subjectId}`]: value,
        };
    }

    saveChanges() {
        const newGrades = Object.entries(this.editedGrades).map(([key, value]) => ({
            student_id: Number(key.split('-')[0]),
            subject_id: Number(key.split('-')[1]),
            value: Number(value)
        }));

        axios.post('/main_api/marks/add_marks', newGrades)
            .then((response) => {
                this.message = response.data.message;
                this.grades = this.grades.map(g =>
                    this.editedGrades[`${g.student_id}-${g.subject_id}`] !== undefined
                        ? { ...g, value: Number(this.editedGrades[`${g.student_id}-${g.subject_id}`]) }
                        : g
                );
                this.editedGrades = {};
            })
            .catch(() => {
                this.message = "Неизвестная ошибка";
            });
    }
}

export default new GradeStore();