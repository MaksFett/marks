"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const students_controller_1 = require("../controllers/students.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const studRoutes = express_1.default.Router();
studRoutes.get('/get_students', authMiddleware_1.authMiddleware, students_controller_1.getStudents);
studRoutes.post('/edit_student', authMiddleware_1.authMiddleware, students_controller_1.editStudent);
studRoutes.post('/add_student', authMiddleware_1.authMiddleware, students_controller_1.addStudent);
studRoutes.post('/delete_student', authMiddleware_1.authMiddleware, students_controller_1.deleteStudent);
exports.default = studRoutes;
