import knex from "knex";

export const knex1 = knex(require('../knexfile.js').development);