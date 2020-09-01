ALTER TABLE `book_belongs_to_author`
	ADD CONSTRAINT `book_belongs_to_author_ibfk1` 
	FOREIGN KEY (`author_id`) 
	REFERENCES `authors`(`id`);

ALTER TABLE `book_belongs_to_author`
	ADD CONSTRAINT `book_belongs_to_author_ibfk2` 
	FOREIGN KEY (`book_id`) 
	REFERENCES `books`(`id`);