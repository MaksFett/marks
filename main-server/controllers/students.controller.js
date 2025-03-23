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
exports.getStudents = getStudents;
exports.editStudent = editStudent;
exports.addStudent = addStudent;
exports.deleteStudent = deleteStudent;
const db_service_1 = require("../services/db_service");
function getStudents(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, db_service_1.knex1)('students')
            .select("id", "fio", "group", "enter_year")
            .then(data => {
            res.status(200).json(data);
        })
            .catch(err => {
            res.status(500).json({ message: 'Ошибка при получении данных' + err });
        });
    });
}
function editStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = req.body;
        if (student.enter_year < 1984 || student.enter_year > 2077) {
            res.status(406).json({ message: "Недопустимое значение года поступления" });
            return;
        }
        (0, db_service_1.knex1)('students')
            .update({
            "fio": student.fio,
            "group": student.group,
            "enter_year": student.enter_year
        })
            .where({ "id": student.id })
            .then(studId => {
            res.status(200).json({ message: 'Студент ' + studId + ' изменен' });
        })
            .catch((err) => {
            res.status(500).json({ message: 'Ошибка при изменении студента' + err });
        });
    });
}
function addStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = req.body;
        if (student.enter_year < 1984 || student.enter_year > 2077) {
            res.status(406).json({ message: "Недопустимое значение года поступления" });
            return;
        }
        (0, db_service_1.knex1)('students')
            .insert({
            "fio": student.fio,
            "group": student.group,
            "enter_year": student.enter_year
        })
            .then(studId => {
            res.status(200).json({ message: 'Студент ' + studId + ' добавлен' });
        })
            .catch((err) => {
            res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
        });
    });
}
function deleteStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        (0, db_service_1.knex1)('students')
            .del()
            .where({ "id": id })
            .then(studId => {
            res.status(200).json({ message: 'Студент ' + studId + ' удален' });
        })
            .catch((err) => {
            res.status(500).json({ message: 'Ошибка при удалении студента' + err });
        });
    });
}
