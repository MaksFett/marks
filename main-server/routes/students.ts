import express, { Request, Response } from "express";
import knex from "knex";
import { IStudent } from "../types";

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

studRoutes.post('/edit_student', (req: Request, res: Response) => {
  const student: IStudent = req.body;
  knex1('students')
    .update({
      "fio": student.fio,
      "group": student.group,
      "enter_year": student.enter_year
    })
    .where({"id": student.id})
    .then(studId => {
      res.status(200).json({ message: 'Студент ' + studId + ' изменен'});
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при изменении студента' + err });
    });
});

studRoutes.post('/add_student', (req: Request, res: Response) => {
  const student: Omit<IStudent,"id"> = req.body;
  knex1('students')
    .insert({
      "fio": student.fio,
      "group": student.group,
      "enter_year": student.enter_year
    })
    .then(studId => {
      res.status(200).json({ message: 'Студент ' + studId + ' добавлен'});
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
    });
});

studRoutes.post('/delete_student', (req: Request, res: Response) => {
  const id: number = req.body.id;
  console.log(id);
  knex1('students')
    .del()
    .where({"id": id})
    .then(studId => {
      res.status(200).json({ message: 'Студент ' + studId + ' удален'});
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при удалении студента' + err });
    });
});

export default studRoutes;