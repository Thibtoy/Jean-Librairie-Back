import { database } from '../../setup/database'

const queries = {
	find: (bookSlug = false) => {
		return new Promise(function(resolve, reject) {
			let connection = database.connect()
            let q = `SELECT b.id, b.title, b.publication, b.image FROM \`books\` AS b`
            if (false !== bookSlug) q += ` WHERE b.slug = '${bookSlug}'`
            else q += ` ORDER BY RAND() LIMIT 12`

            connection.query(q, async (err, data) => {
                if (err) {
                    console.error(err)
                    reject('Something went wrong')
                }
                else {
                	for (let i = 0, l = data.length; i < l; i++) {
                		let book = data[i]
                		book.authors = await getAuthors(book.id, connection)
                		book.categories = await getCategories(book.id, connection)
                	}

                	connection.end()
                	resolve(data)
                }
            })
        })
	},
	findByCategory: (categorySlug = false) => {
		return new Promise(function(resolve, reject) {
			let connection = database.connect()
            let q = `SELECT b.id, b.title, b.publication, b.image FROM \`books\` AS b`

            if (false !== categorySlug) {
            	q += ` LEFT JOIN \`book_belongs_to_category\` AS bc ON bc.book_id = b.id`
            	q += ` LEFT JOIN \`categories\` AS c ON c.id = bc.category_id`
            	q += ` WHERE c.slug = '${ categorySlug }'`
            }

            connection.query(q, async (err, data) => {
                if (err) {
                    console.error(err)
                    reject('Something went wrong')
                }
                else {
                	for (let i = 0, l = data.length; i < l; i++) {
                		let book = data[i]
                		book.authors = await getAuhors(book.id, connection)
                		book.categories = await getCategories(book.id, connection)
                	}

                	connection.end()
                	resolve(data)
                }
            })
        })
	},
    getRemaningBooks(bookId) {
        return new Promise((resolve, reject) => {
            let connection = database.connect()
            let q = `SELECT b.id, b.quantity, COUNT(ub.id) AS nbOfBorrow FROM \`books\` AS b `+
            `LEFT JOIN \`user_borrows_book\` AS ub ON ub.book_id = b.id `+
            `WHERE b.id = ${ bookId } && ub.returned IS NULL GROUP BY b.id`

            connection.query(q, (err, data) => {
                if (err) reject(err)
                else {
                    if (data.length > 0) resolve(data[0])
                    else resolve(false)
                }
            })
        })
    }
}

export function getAuthors(bookId, connection) {
	return new Promise((resolve, reject) => {
		let q = `SELECT a.name, ba.id FROM \`authors\` AS a `+
		`LEFT JOIN \`book_belongs_to_author\` AS ba ON ba.author_id = a.id WHERE ba.book_id = ${ bookId }`

		connection.query(q, (err, data) => {
			if (err) reject(err)
			else resolve(data)
		})
	})
}

export function getCategories(bookId, connection) {
	return new Promise((resolve, reject) => {
		let q = `SELECT c.name, c.slug, bc.id FROM \`categories\` AS c `+
		`LEFT JOIN \`book_belongs_to_category\` AS bc ON bc.category_id = c.id WHERE bc.book_id = ${ bookId }`

		connection.query(q, (err, data) => {
			if (err) reject(err)
			else resolve(data)
		})
	})
}

export default queries