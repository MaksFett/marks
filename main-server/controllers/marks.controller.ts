import { Request, Response } from "express";
import { IGrade, IShortStudent, ISubject } from "../types";
import { knex1 } from "../services/db_service";

export async function getMarks(_req: Request, res: Response) {
  var full_marks: Array<IGrade>;
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
                            let student_id = (st as any as IShortStudent).id;
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
      res.status(500).json({ message: 'Ошибка при получении данных ' + err });
    });
}

export async function addMarks(req: Request, res: Response) {
  const marks: Array<IGrade> = req.body as Array<IGrade>;
  for (let i of marks) {
      if (i.value && (i.value < 0 || i.value > 5)) {
        res.status(406).json({ message: "Недопустимое значение оценки" });
        return;
      }
    }
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
      res.status(500).json({ message: 'Ошибка при добавлении оценок ' + err });
    });
}