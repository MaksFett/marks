"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const marks_1 = __importDefault(require("./routes/marks"));
const students_1 = __importDefault(require("./routes/students"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5051;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.status(200).send('Server is up and running');
});
app.use('/marks', marks_1.default);
app.use('/students', students_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});
