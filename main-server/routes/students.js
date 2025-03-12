"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const studRoutes = express_1.default.Router();
const knex1 = (0, knex_1.default)(require('../knexfile.js').development);
studRoutes.get('/get_students', (_req, res) => {
    knex1('students')
        .select("id", "fio", "group", "enter_year")
        .then(data => {
        res.status(200).json(data);
    })
        .catch(err => {
        res.status(500).json({ message: 'Ошибка при получении данных' + err });
    });
});
studRoutes.post('/add_student', (req, res) => {
    knex1('students')
        .insert({
        "fio": req.body.fio,
        "group": req.body.group,
        "enter_year": req.body.enter_year
    })
        .then(studId => {
        res.status(200).json({ message: 'Студент ' + studId + ' добавлен' });
    })
        .catch((err) => {
        res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
    });
});
exports.default = studRoutes;
