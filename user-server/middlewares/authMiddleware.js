"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({ message: "Вы не авторизованны" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.user = decoded;
        next();
    }
    catch (_a) {
        res.status(403).json({ message: "Неправильный токен" });
    }
};
exports.authMiddleware = authMiddleware;
