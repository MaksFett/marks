"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const userRoutes = express_1.default.Router();
const knex1 = (0, knex_1.default)(require('../knexfile.js').development);
userRoutes.get('/', (_req, res) => {
    knex1('users')
        .orderBy('login', 'desc')
        .then(data => {
        res.status(200).json(data);
    })
        .catch(err => {
        res.status(500).json({ message: 'Error fetching users' + err });
    });
});
userRoutes.post('/', (req, res) => {
    knex1('users')
        .insert({
        login: req.body.login,
        password_hash: req.body.password,
        email: req.body.email
    })
        .then(userId => {
        res.status(201).json({ newUserId: userId[0] });
    })
        .catch((err) => {
        res.status(500).json({ message: 'Error creating new user ' + err });
    });
});
exports.default = userRoutes;
