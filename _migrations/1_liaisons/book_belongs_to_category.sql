ALTER TABLE `book_belongs_to_category`
	ADD CONSTRAINT `book_belongs_to_category_ibfk1` 
	FOREIGN KEY (`category_id`) 
	REFERENCES `categories`(`id`);

ALTER TABLE `book_belongs_to_category`
	ADD CONSTRAINT `book_belongs_to_category_ibfk2` 
	FOREIGN KEY (`book_id`) 
	REFERENCES `books`(`id`);