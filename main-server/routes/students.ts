import express from "express";
import { getStudents, editStudent, addStudent, deleteStudent } from "../controllers/students.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const studRoutes = express.Router();

studRoutes.get('/get_students', authMiddleware, getStudents);

studRoutes.post('/edit_student', authMiddleware, editStudent);

studRoutes.post('/add_student', authMiddleware, addStudent);

studRoutes.post('/delete_student', authMiddleware, deleteStudent);

export default studRoutes;