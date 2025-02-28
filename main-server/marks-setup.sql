CREATE TABLE IF NOT EXISTS `marks` (
  `student_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `value` int CHECK (`value`>=0 and `value`<=5) NOT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  PRIMARY KEY (`student_id`, `subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;