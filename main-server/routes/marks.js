"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marks_controller_1 = require("../controllers/marks.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const markRoutes = express_1.default.Router();
markRoutes.get('/get_marks', authMiddleware_1.authMiddleware, marks_controller_1.getMarks);
markRoutes.post('/add_marks', authMiddleware_1.authMiddleware, marks_controller_1.addMarks);
exports.default = markRoutes;
