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
				let operations = fs.readdirSync(`./_migrations/${migration}`)
				let operationName = migration.split('_')[1]

				for (let j = 0, n = operations.length; j < n; j++) {
					let operation = operations[j]
					let sqls = fs.readFileSync(`./_migrations/${migration}/${operation}`).toString().replace(/\\;/gi, '/$\\').split(';')

					console.info(`Creating ${operationName.substring(0, operationName.length - 1).toLowerCase()} \`${operation.split('.')[0]}\``)

					await sqls.forEach(async (sql, i) => {
						await new Promise ((resolve, reject) => {
							if (i === (sqls.length - 1)) resolve(true)
							connection.query(sql.replace(/\/\$\\/gi, ';'), (err) => {
								if (err) reject(err)
								else resolve()
							})
						})
						.then((end) => {
							if (end) console.info(`${operationName[0].toUpperCase() + operationName.slice(1)} ${operation.split('.')[0]} successfully created!`)
						})
						.catch(err => {throw err})
					})

				}

				if ('tables' === operationName) {
					console.info('loading books datas')
					await loadBooksData(connection)
					console.info('books data successfully loaded')
				}
			}

			connection.end()

			console.info('Your database is ready to use')
		})
	})
}