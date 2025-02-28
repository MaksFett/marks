CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fio` varchar(50) NOT NULL,
  `group` varchar(8) NOT NULL,
  `enter_year` int CHECK (`enter_year`>1984 and `enter_year`<2077) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;