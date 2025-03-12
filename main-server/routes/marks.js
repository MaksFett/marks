"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const markRoutes = express_1.default.Router();
const knex1 = (0, knex_1.default)(require('../knexfile.js').development);
markRoutes.get('/get_marks', (_req, res) => {
    var full_marks = [];
    knex1('marks')
        .select("student_id", "subject_id", "value")
        .then(marks => {
        knex1('students')
            .select("id", "fio")
            .then(students => {
            knex1('subjects')
                .select("id", "name")
                .then(subjects => {
                full_marks = marks;
                for (let st of students) {
                    for (let sub of subjects) {
                        let student_id = st.id;
                        let subject_id = sub.id;
                        if (!full_marks.find((mark) => mark.student_id == student_id && mark.subject_id == subject_id)) {
                            full_marks.push({ "student_id": student_id, "subject_id": subject_id, "value": null });
                        }
                    }
                }
                res.status(200).json({ marks: full_marks, students: students, subjects: subjects });
            });
        });
    })
        .catch(err => {
        res.status(500).json({ message: 'Ошибка при получении данных' + err });
    });
});
markRoutes.post('/add_marks', (req, res) => {
    const marks = req.body.marks;
    knex1('marks')
        .insert(marks)
        .onConflict("student_id-subject_id")
        .merge()
        .then(() => {
        res.status(200).json({ message: "Оценки успешно добавлены" });
    })
        .catch((err) => {
        res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
    });
});
exports.default = markRoutes;
