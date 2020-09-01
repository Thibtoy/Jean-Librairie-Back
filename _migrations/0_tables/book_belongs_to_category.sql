CREATE TABLE `book_belongs_to_category` ( 
	`id` INT NOT NULL AUTO_INCREMENT, 
	`book_id` INT NOT NULL,
	`category_id` INT NOT NULL, 
	 PRIMARY KEY (`id`)
) ENGINE = InnoDB;