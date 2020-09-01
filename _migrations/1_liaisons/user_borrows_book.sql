ALTER TABLE `user_borrows_book`
	ADD CONSTRAINT `user_borrows_book_ibfk1` 
	FOREIGN KEY (`user_id`) 
	REFERENCES `users`(`id`);

ALTER TABLE `user_borrows_book`
	ADD CONSTRAINT `user_borrows_book_ibfk2` 
	FOREIGN KEY (`book_id`) 
	REFERENCES `books`(`id`);