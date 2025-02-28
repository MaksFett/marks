CREATE TABLE IF NOT EXISTS `users` (
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `email` varchar(30),
  PRIMARY KEY (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `users` (`login`,`password_hash`,`email`) VALUES ('qwe', 'qwe', 'qwe');