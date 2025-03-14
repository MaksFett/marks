CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL UNIQUE,
  `course` int CHECK (`course`>0 and `course`<7) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Технологии обработки больших данных', '4');
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Системное программирование', '2');
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Математический анализ', '1');
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Фреймворки web-приложений', '4');
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Философия', '2');
INSERT INTO `subjects` (`name`,`course`) VALUES (N'Правоведение', '3');