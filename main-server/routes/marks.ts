import express, { Request, Response } from "express";
import knex from "knex";

const markRoutes = express.Router();
const knex1 = knex(require('../knexfile.js').development);

markRoutes.get('/', (_req: Request, res: Response) => {
  knex1('marks')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching marks' + err });
    });
});

markRoutes.post('/', (req: Request, res: Response) => {
  knex1('users')
    .insert({
      login: req.body.login,
      password_hash: req.body.password,
      email: req.body.email,
      cathedra: req.body.cathedra
    })
    .then(markId => {
      res.status(201).json({ newMarkId: markId[0] });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error creating new mark' + err });
    });
});

export default markRoutes;