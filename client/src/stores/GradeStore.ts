import { makeAutoObservable } from "mobx";
import axios from "axios";
import { IGrade } from "../types";

class GradeStore {
    students = [];
    subjects = [];
    grades = [];
    cacheTimestamp = null;
    cacheDuration = 60000;
    
    constructor() {
        makeAutoObservable(this);
    }

    isCacheValid = () => {
        return (
            this.cacheTimestamp &&
            Date.now() - this.cacheTimestamp < this.cacheTimestamp
        );
    }

    async fetchGrades() {
        if (this.grades.length > 0 && this.isCacheValid()){
            return;
        }
        try {
            const response = await axios.get("/main_api/marks/get_marks");
            this.students = response.data.students;
            this.subjects = response.data.subjects;
            this.grades = response.data.marks;
        } catch (error) {
            console.error("Ошибка загрузки оценок:", error);
        }
    }

    async saveGrades(editedGrades: Array<IGrade>) {
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
