import { Request, Response } from "express";
import { IStudent } from "../types";
import { knex1 } from "../services/db_service";

export async function getStudents(_req: Request, res: Response) {
  knex1('students')
    .select("id", "fio", "group", "enter_year")
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Ошибка при получении данных' + err });
    });
}

export async function editStudent(req: Request, res: Response) {
  const student: IStudent = req.body;
  if (student.enter_year < 1984 || student.enter_year > 2077) {
    res.status(406).json({ message: "Недопустимое значение года поступления" });
    return;
  }
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
}

export async function addStudent(req: Request, res: Response) {
  const student: Omit<IStudent,"id"> = req.body;
  if (student.enter_year < 1984 || student.enter_year > 2077) {
    res.status(406).json({ message: "Недопустимое значение года поступления" });
    return;
  }
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
}

export async function deleteStudent(req: Request, res: Response) {
  const id: number = req.body.id;
  knex1('students')
    .del()
    .where({"id": id})
    .then(studId => {
      res.status(200).json({ message: 'Студент ' + studId + ' удален'});
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при удалении студента' + err });
    });
}