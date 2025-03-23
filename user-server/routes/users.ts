import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { register, login, refresh, logout, getUser, getLogin } from "../controllers/users.controller";

const userRoutes = express.Router();

userRoutes.post('/register', register);

userRoutes.post('/login', login);

userRoutes.post('/refresh', refresh);

userRoutes.get('/logout', authMiddleware, logout);

userRoutes.get('/get_user', authMiddleware, getUser);

userRoutes.get('/get_login', authMiddleware, getLogin);

export default userRoutes;