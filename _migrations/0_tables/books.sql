CREATE TABLE `books` ( 
	`id` INT NOT NULL AUTO_INCREMENT, 
	`title` VARCHAR(255) NOT NULL,
	`slug` VARCHAR(255) NOT NULL,
	`image` VARCHAR(255) DEFAULT NULL, 
	`publication` DATE DEFAULT NULL, 
	`description` TEXT NOT NULL,
	`quantity` INT NOT NULL,
	`disponible` BOOLEAN NOT NULL DEFAULT 0,
	 PRIMARY KEY (`id`)
) ENGINE = InnoDB;