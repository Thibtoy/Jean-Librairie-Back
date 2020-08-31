import { database, noDatabase, databaseName } from './database'
import fs from 'fs'
import loadBooksData from '../data/load-books-data'

export default function databaseInitialisation() {
	let connection = noDatabase.connect()

	console.info('Creating database')

	connection.query(`DROP DATABASE IF EXISTS ${databaseName}`, err => {
		if (err) throw err
		connection.query(`CREATE DATABASE ${databaseName} CHARACTER SET utf8`, async err => {
			connection.end()
			if (err) throw err

			console.info('Database successfully created, executing migrations')

			let migrations = fs.readdirSync('./_migrations')
			connection = database.connect()

			for (let i = 0, l = migrations.length; i < l; i++) {
				let migration = migrations[i]
				let sqls = fs.readFileSync(`./_migrations/${migration}`).toString().replace(/\\;/gi, '/$\\').split(';')

				console.info(`Creating table \`${migration.split('.')[0]}\``)

				await sqls.forEach(async (sql, i) => {
					await new Promise ((resolve, reject) => {
						if (i === (sqls.length - 1)) resolve(true)
						connection.query(sql.replace(/\/\$\\/gi, ';'), (err) => {
							if (err) reject(err)
							else resolve()
						})
					})
					.then((end) => {
						if (end) console.info(`Table ${migration.split('.')[0]} successfully created!`)
					})
					.catch(err => {throw err})
				})
			}
			console.info('Your database is ready to use')

			loadBooksData()
			
			connection.end()
		})
	})
}