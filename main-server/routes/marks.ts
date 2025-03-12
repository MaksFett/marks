import express, { Request, Response } from "express";
import knex from "knex";

const markRoutes = express.Router();
const knex1 = knex(require('../knexfile.js').development);

type IStudent = {
    "id": number,
    "fio": string
}

type ISubject = {
    "id": number,
    "name": string
}

markRoutes.get('/get_marks', (_req: Request, res: Response) => {
  var full_marks: { student_id: number; subject_id: number; value: null; }[] = [];
  knex1('marks')
    .select("student_id", "subject_id", "value")
    .then(marks => {
      knex1('students')
        .select("id", "fio")
        .then(students => {
            knex1('subjects')
                .select("id", "name")
                .then(subjects => {
                    full_marks = marks;
                    for (let st of students){
                        for (let sub of subjects){
                            let student_id = (st as any as IStudent).id;
                            let subject_id = (sub as any as ISubject).id;
                            if (!full_marks.find((mark) => mark.student_id == student_id && mark.subject_id == subject_id )) {
                                full_marks.push({"student_id": student_id, "subject_id": subject_id, "value": null })
                            }
                        }
                    }
                    res.status(200).json({ marks: full_marks, students: students, subjects: subjects});
                })
        })
    })
    .catch(err => {
      res.status(500).json({ message: 'Ошибка при получении данных' + err });
    });
});

markRoutes.post('/add_marks', (req: Request, res: Response) => {
  const marks = req.body.marks;
  knex1('marks')
    .insert(
      marks
    )
    .onConflict("student_id-subject_id")
    .merge()
    .then(() => {
      res.status(200).json({ message: "Оценки успешно добавлены" });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Ошибка при добавлении студента' + err });
    });
});

export default markRoutes;