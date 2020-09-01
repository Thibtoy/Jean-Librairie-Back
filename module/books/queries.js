import { database } from '../../setup/database'

const queries = {
	getAll: () => {
		return new Promise(function(resolve, reject) {
			let connection = database.connect()
            let q = `SELECT b.id, b.title, b.publication, b.image, a.name, c.name FROM books AS b `+
            `LEFT JOIN book_belongs_to_author AS ba ON ba.book_id = b.id `+
            `LEFT JOIN book_belongs_to_category AS bc ON bc.book_id = b.id `+
            `LEFT JOIN authors AS a ON ba.author_id = a.id LEFT JOIN categories AS c ON bc.category_id = c.id`

            connection.query(q, (err, data) => {
                connection.end()
                if (err) {
                    console.error(err)
                    reject('Something went wrong')
                }
                else resolve(data)
            })
        })
	},

	byCategory: (req, res) => {

	}
}

export default queries