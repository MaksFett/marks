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
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getUser = getUser;
exports.getLogin = getLogin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_service_1 = require("../services/db_service");
const tokenUtil_1 = require("../utils/tokenUtil");
let refreshTokens = [];
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password, email } = req.body;
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            (0, db_service_1.knex1)('users')
                .where({ "login": login })
                .select("login")
                .then((users) => __awaiter(this, void 0, void 0, function* () {
                if (users.length > 0)
                    return res.status(404).json({ message: "Пользователь с таким логином уже существует" });
                (0, db_service_1.knex1)('users')
                    .insert({ "login": login, "password": hashedPassword, "email": email })
                    .then(() => {
                    const { accessToken, refreshToken } = (0, tokenUtil_1.generateTokens)(login);
                    refreshTokens.push(refreshToken);
                    res.status(200).json({ "accessToken": accessToken, "refreshToken": refreshToken });
                });
            }));
        }
        catch (err) {
            res.status(500).json({ message: "Ошибка в регистрации пользователя: " + err });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = req.body;
        (0, db_service_1.knex1)('users')
            .where({ "login": login })
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user.length == 0)
                return res.status(404).json({ message: "Неверный логин" });
            const isMatch = yield bcrypt_1.default.compare(password, user[0].password);
            if (!isMatch)
                return res.status(400).json({ message: "Неверный пароль" });
            const { accessToken, refreshToken } = (0, tokenUtil_1.generateTokens)(login);
            refreshTokens.push(refreshToken);
            res.status(200).json({ "accessToken": accessToken, "refreshToken": refreshToken });
        }))
            .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Ошибка авторизации пользователя: " + err });
        });
    });
}
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header("refresh-token");
        if (!token) {
            res.status(401).json({ message: "Вы не авторизованы" });
            return;
        }
        if (!refreshTokens.includes(token)) {
            res.status(402).json({ message: "Неверный токен" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            const { accessToken, refreshToken: newRefreshToken } = (0, tokenUtil_1.generateTokens)(decoded.login);
            refreshTokens = refreshTokens.filter(t => t !== token);
            refreshTokens.push(newRefreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({ message: "" });
        }
        catch (err) {
            res.status(403).json({ message: "Неправильный refresh-токен" });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        refreshTokens = refreshTokens.filter(t => t !== req.cookies.refreshToken);
        res.json({ message: "Выход" });
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login } = req.body.user;
        (0, db_service_1.knex1)('users')
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
    });
}
function getLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const login = req.body.user.login;
        res.status(200).json({ "login": login });
    });
}
