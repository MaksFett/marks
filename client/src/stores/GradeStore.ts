import { makeAutoObservable } from "mobx";
import axios from "axios";
import { IGrade } from "../types";
import { IShortStudent } from "../types";
import { ISubject } from "../types";

class GradeStore {
    students: IShortStudent[] = [];
    subjects: ISubject[] = [];
    grades: IGrade[] = [];
    cacheTimestamp: number | null = null;
    cacheDuration = 60000;
    
    constructor() {
        makeAutoObservable(this);
    }

    isCacheValid = () => {
        return (
            this.cacheTimestamp &&
            Date.now() - this.cacheTimestamp < this.cacheDuration
        );
    }

    async fetchGrades() {
        if (this.grades.length > 0 && this.isCacheValid()){
            return;
        }
        try {
            const response = await axios.get("/main_api/marks/get_marks", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            this.setStudents(response.data.students);
            this.setSubjects(response.data.subjects);
            this.setGrades(response.data.marks);
            this.cacheTimestamp = Date.now();
        } catch (error) {
            console.error("Ошибка загрузки оценок:", error);
        }
    }

    async saveGrades(editedGrades: { [key: string]: number }) {
        const newGrades = Object.entries(editedGrades).map(([key, value]) => {
            const [student_id, subject_id] = key.split("-");
            return {
                student_id: Number(student_id),
                subject_id: Number(subject_id),
                value: Number(value),
            };
        });
    
        try {
            await axios.post("/main_api/marks/add_marks", newGrades, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            await this.fetchGrades();
            return true;
        } catch (error) {
            console.error("Ошибка сохранения оценок:", error);
            return false;
        }
    }
    

    updateGrades(edited: { [key: string]: number }) {
        this.grades = this.grades.map(g =>
            edited[`${g.student_id}-${g.subject_id}`] !== undefined
                ? { ...g, value: edited[`${g.student_id}-${g.subject_id}`] }
                : g
        );
    }

    setStudents(students: IShortStudent[]) {
        this.students = students;
    }

    setSubjects(subjects: ISubject[]) {
        this.subjects = subjects;
    }

    setGrades(grades: IGrade[]) {
        this.grades = grades;
    }
}

export default new GradeStore();
