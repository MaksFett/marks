import express, { Request, Response } from "express";
import knex from "knex";

const studRoutes = express.Router();
const knex1 = knex(require('../knexfile.js').development);

studRoutes.get('/get_students', (_req: Request, res: Response) => {
  knex1('students')
    .select("id", "fio", "group", "enter_year")
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Ошибка при получении данных' + err });
    });
});

studRoutes.post('/add_student', (req: Request, res: Response) => {
  knex1('students')
    .insert({
      "fio": req.body.fio,
      "group": req.body.group,
      "enter_year": req.body.enter_year
    })
    .then(studId => {
      res.status(200).json({ message: 'Студент ' + studId + ' добавлен'});
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
    });
});

export default studRoutes;