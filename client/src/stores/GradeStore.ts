import { makeAutoObservable } from "mobx";
import axios from "axios";

class GradeStore {
    students = [];
    subjects = [];
    grades = [];
    
    constructor() {
        makeAutoObservable(this);
    }

    async fetchGrades() {
        try {
            const response = await axios.get("/main_api/marks/get_marks");
            this.students = response.data.students;
            this.subjects = response.data.subjects;
            this.grades = response.data.marks;
        } catch (error) {
            console.error("Ошибка загрузки оценок:", error);
        }
    }

    async saveGrades(editedGrades) {
        const newGrades = Object.entries(editedGrades).map(([key, value]) => {
            const [student_id, subject_id] = key.split("-");
            return { student_id: Number(student_id), subject_id: Number(subject_id), value: Number(value) };
        });

        try {
            await axios.post("/main_api/marks/add_marks", newGrades);
            this.fetchGrades(); // Обновляем оценки после сохранения
        } catch (error) {
            console.error("Ошибка сохранения оценок:", error);
        }
    }
}

export default new GradeStore();
