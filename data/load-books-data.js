import axios from 'axios'

const dataModels = [
	{ category: 'Fiction', url: 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&langRestrict=fr' },
	{ category: 'Comedy', url: 'https://www.googleapis.com/books/v1/volumes?q=subject:comique&langRestrict=fr' },
	{ category: 'Science', url: 'https://www.googleapis.com/books/v1/volumes?q=subject:science&langRestrict=fr' },
	{ category: 'Amour', url: 'https://www.googleapis.com/books/v1/volumes?q=subject:amour&langRestrict=fr' },
]

export default (connection) => {
	return new Promise(async resolve => {
		for (let i = 0, l = dataModels.length; i < l; i++) {
			let model = dataModels[i]
			let categoryId = await createCategory(model.category, connection)
			let books = await getBooks(model.url)

			for (let j = 0, n = books.length; j < n; j++) {
				let bookInfos = books[j].volumeInfo
				let book = new Object()
				let publication = new Date(bookInfos.publishedDate)
				let authorIds = await getAuthorsId(bookInfos.authors, connection)
				let bookId

				book.title = bookInfos.title
				book.image = (bookInfos.imageLinks && bookInfos.imageLinks.thumbnail)? bookInfos.imageLinks.thumbnail : null
				book.description = bookInfos.description || "/"
				book.quantity = 3
				book.publication = (publication.getFullYear().toString() !== 'NaN') ? (publication.getFullYear() + '-01-01') : null
				
				bookId = await createBook(book, connection)

				await linkBookToAuthors(bookId, authorIds, connection)
				await linkBookToCategory(bookId, categoryId, connection)
			}
		}
		resolve()
	})
}

function createCategory(category, connection) {
	return new Promise((resolve, reject) => {
		connection.query('INSERT INTO `categories` SET ?', { name: category }, async (err, result) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			else resolve(result.insertId)
		})
	})
}

function getAuthorsId(authors = new Array(), connection) {
	return new Promise(async (resolve) => {
		let authorIds = []

		for (let i = 0, l = authors.length; i < l; i++) {
			await new Promise((resolve) => {
				connection.query(`SELECT id FROM \`authors\` WHERE authors.name = '${authors[i]}'`, (err, result) => {
					if (err) throw err
					else if (result.length > 0) resolve(result[0].id)
					else {
						connection.query('INSERT INTO `authors` SET ?', { name: authors[i] }, (err, result) => {
							if (err) throw err
							else resolve(result.insertId)
						})
					}
				})
			})
			.then(id => authorIds.push(id))
			.catch(err => {throw err})
		}

		resolve(authorIds)
	})
}

function getBooks(url) {
	return new Promise(resolve => {
		axios.get(url)
			.then(res => resolve(res.data.items))
			.catch(err => { throw err })
	})
}

function createBook(book, connection) {
	return new Promise(resolve => {
		connection.query('INSERT INTO `books` SET ?', book, (err, res) => {
			if (err) throw err
			resolve(res.insertId)
		})
	})
}

function linkBookToAuthors(bookId, authorIds, connection) {
	return new Promise(async resolve => {
		for (let i = 0, l = authorIds.length; i < l; i++) {
			let authorId = authorIds[i]
			await new Promise(resolve => {
				let datas = {"book_id": bookId, "author_id": authorId}
				connection.query('INSERT INTO `book_belongs_to_author` SET ?', datas, err => {
					if (err) throw err
					resolve()
				})
			})
		}
		resolve()
	})
}

function linkBookToCategory(bookId, categoryId, connection) {
	return new Promise(async resolve => {
		let datas = {"book_id": bookId, "category_id": categoryId}
		connection.query('INSERT INTO `book_belongs_to_category` SET ?', datas, err => {
			if (err) throw err
			resolve()
		})
	})
}