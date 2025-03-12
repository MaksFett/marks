CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fio` varchar(50) NOT NULL,
  `group` varchar(50) NOT NULL,
  `enter_year` int CHECK (`enter_year`>1984 and `enter_year`<2077) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `students` (`fio`,`group`,`enter_year`) VALUES ('Фетисов Максим Евгеньевич', 'ИУК4-81Б', '2021');
INSERT INTO `students` (`fio`,`group`,`enter_year`) VALUES ('Иванов Иван Иванович', 'ИУК4-42Б', '2023');
INSERT INTO `students` (`fio`,`group`,`enter_year`) VALUES ('Петров Петр Петрович', 'ИУК3-61Б', '2022');