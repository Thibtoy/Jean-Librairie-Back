import { database } from '../../setup/database'

export default {
	find: () => {
		return new Promise((resolve, reject) => {
			let connection = database.connect()
			let q = `SELECT name, slug FROM \`categories\``

			connection.query(q, (err, data) => {
				if (err) {
					console.error(err)
					reject('Something went wrong')
				}
				else resolve(data)
			})
		})
	}
}