"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex1 = void 0;
const knex_1 = __importDefault(require("knex"));
exports.knex1 = (0, knex_1.default)(require('../knexfile.js').development);
