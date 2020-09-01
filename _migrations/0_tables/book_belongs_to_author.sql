CREATE TABLE `book_belongs_to_author` ( 
	`id` INT NOT NULL AUTO_INCREMENT, 
	`book_id` INT NOT NULL,
	`author_id` INT NOT NULL, 
	 PRIMARY KEY (`id`)
) ENGINE = InnoDB;