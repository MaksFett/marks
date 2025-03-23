"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarks = getMarks;
exports.addMarks = addMarks;
const db_service_1 = require("../services/db_service");
function getMarks(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var full_marks;
        (0, db_service_1.knex1)('marks')
            .select("student_id", "subject_id", "value")
            .then(marks => {
            (0, db_service_1.knex1)('students')
                .select("id", "fio")
                .then(students => {
                (0, db_service_1.knex1)('subjects')
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
            res.status(500).json({ message: 'Ошибка при получении данных ' + err });
        });
    });
}
function addMarks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const marks = req.body;
        for (let i of marks) {
            if (i.value && (i.value < 0 || i.value > 5)) {
                res.status(406).json({ message: "Недопустимое значение оценки" });
                return;
            }
        }
        (0, db_service_1.knex1)('marks')
            .insert(marks)
            .onConflict("student_id-subject_id")
            .merge()
            .then(() => {
            res.status(200).json({ message: "Оценки успешно добавлены" });
        })
            .catch((err) => {
            res.status(500).json({ message: 'Ошибка при добавлении оценок ' + err });
        });
    });
}
