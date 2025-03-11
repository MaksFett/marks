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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRoutes = express_1.default.Router();
const knex1 = (0, knex_1.default)(require('../knexfile.js').development);
const generateTokens = (login) => {
    const accessToken = jsonwebtoken_1.default.sign({ "login": login }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log(process.env.JWT_REFRESH_SECRET);
    const refreshToken = jsonwebtoken_1.default.sign({ "login": login }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    console.log('123');
    return { accessToken, refreshToken };
};
let refreshTokens = [];
userRoutes.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        knex1('users')
            .where({ "login": login })
            .select("login")
            .then((users) => __awaiter(void 0, void 0, void 0, function* () {
            if (users.length > 0)
                return res.status(404).json({ message: "Пользователь с таким логином уже существует" });
            knex1('users')
                .insert({ "login": login, "password": hashedPassword, "email": email })
                .then(() => {
                const { accessToken, refreshToken } = generateTokens(login);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ accessToken });
            });
        }));
    }
    catch (err) {
        res.status(500).json({ message: "Ошибка в регистрации пользователя: " + err });
    }
}));
userRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    knex1('users')
        .where({ "login": login })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.length == 0)
            return res.status(404).json({ message: "Неверный логин" });
        const isMatch = yield bcrypt_1.default.compare(password, user[0].password);
        if (!isMatch)
            return res.status(400).json({ message: "Неверный пароль" });
        const { accessToken, refreshToken } = generateTokens(login);
        refreshTokens.push(refreshToken);
        console.log(refreshTokens);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken });
    }))
        .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Ошибка авторизации пользователя: " + err });
    });
}));
userRoutes.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ message: "Вы не авторизованы" });
        return;
    }
    if (!refreshTokens.includes(token)) {
        res.status(403).json({ message: "Неверный токен" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.login);
        refreshTokens = refreshTokens.filter(t => t !== token);
        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
    }
    catch (err) {
        res.status(403).json({ message: "Неправильный refresh-токен" });
    }
});
userRoutes.post('/logout', authMiddleware_1.authMiddleware, (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(t => t !== req.cookies.refreshToken);
    res.json({ message: "Выход" });
});
userRoutes.get('/get_user', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login } = req.body;
    knex1('users')
        .select("login", "email")
        .where({ "login": login })
        .then((user) => {
        if (user.length == 0)
            return res.status(404).json({ message: "Нет такого пользователя" });
        res.status(200).json({ user: user[0] });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Ошибка получения пользователя: " + err });
    });
}));
userRoutes.get('/get_login', authMiddleware_1.authMiddleware, (req, res) => {
    const login = req.body.user.login;
    res.status(200).json({ login });
});
exports.default = userRoutes;
