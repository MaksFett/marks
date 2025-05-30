"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = {
    development: {
        // Necessary for being able to connect to MySQL container with correct AUTH type
        client: 'mysql2',
        connection: {
            // "db" refers to the name of the service in docker-compose
            host: 'db',
            // Environment variables are defined in the api service in docker-compose
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            charset: 'utf8',
        }
    }
};
