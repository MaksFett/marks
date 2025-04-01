"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const users_controller_1 = require("../controllers/users.controller");
const userRoutes = express_1.default.Router();
userRoutes.post('/register', users_controller_1.register);
userRoutes.post('/login', users_controller_1.login);
userRoutes.post('/refresh', users_controller_1.refresh);
userRoutes.get('/logout', authMiddleware_1.authMiddleware, users_controller_1.logout);
userRoutes.get('/get_user', authMiddleware_1.authMiddleware, users_controller_1.getUser);
userRoutes.get('/get_login', authMiddleware_1.authMiddleware, users_controller_1.getLogin);
exports.default = userRoutes;
