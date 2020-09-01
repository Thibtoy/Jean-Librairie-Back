CREATE TABLE `user_borrows_book` ( 
	`id` INT NOT NULL AUTO_INCREMENT, 
	`book_id` INT NOT NULL, 
	`user_id` INT NOT NULL,
	`borrowed` DATE NOT NULL, 
	`returned` DATE DEFAULT NULL,
	 PRIMARY KEY (`id`)
) ENGINE = InnoDB;