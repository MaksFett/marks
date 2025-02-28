import express, { Request, Response } from "express";
import knex from "knex";

const userRoutes = express.Router();
const knex1 = knex(require('../knexfile.js').development);

userRoutes.get('/', (_req: Request, res: Response) => {
  knex1('users')
    .orderBy('login', 'desc')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching users' + err });
    });
});

userRoutes.post('/', (req: Request, res: Response) => {
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

export default userRoutes;