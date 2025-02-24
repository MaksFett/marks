CREATE TABLE IF NOT EXISTS `users` (
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `email` varchar(30),
  `cathedra` varchar(4),
  PRIMARY KEY (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;