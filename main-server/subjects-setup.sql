CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL UNIQUE,
  `course` int CHECK (`course`>0 and `course`<7) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `subjects` (`name`,`course`) VALUES ('Технологии обработки больших данных', '4');
INSERT INTO `subjects` (`name`,`course`) VALUES ('Системное программирование', '4');
INSERT INTO `subjects` (`name`,`course`) VALUES ('Математический анализ', '3');