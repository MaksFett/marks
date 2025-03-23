import express from "express";
import { getMarks, addMarks } from "../controllers/marks.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const markRoutes = express.Router();

markRoutes.get('/get_marks', authMiddleware, getMarks);

markRoutes.post('/add_marks', authMiddleware, addMarks);

export default markRoutes;