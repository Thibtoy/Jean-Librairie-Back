import { database } from "../../setup/database"
import { getAuthors, getCategories } from "../books/queries"

const Query = {
    register: (user) => {
        return new Promise(function(resolve, reject) {
            let q = `INSERT INTO users (username, email, password, role) VALUES (`+
            `'${user.username}', '${user.email}', '${user.password}', 'user');`
            let connection = database.connect()
            connection.query(q, (err, data) => {
                connection.end()
                if (err) {
                    reject(err)
                    (err.sqlState === '23000')? reject('User already exist') : reject('Something went wrong')
                }
                else resolve(data)
            })
        })
    },
    getUser: user => {
        return new Promise(function(resolve, reject) {
            let q = `SELECT * FROM users WHERE users.email = '${user.email}';`
            let connection = database.connect()
            connection.query(q, (err, data) => {
                connection.end()
                if (err) reject(err)
                else if (data.length > 0) resolve(data[0])
                else reject('User does not exist')
            })
        })
    },
    getUserById: userId => {
        return new Promise(function(resolve, reject) {
            let q = `SELECT id, username FROM users WHERE users.id = ${userId}`
            let connection = database.connect()
            connection.query(q, (err, data) => {
                connection.end()
                if (err) reject(err)
                else if (data.length > 0) resolve(data[0])
                else reject('User does not exist')
            })
        })
    },
    getUserRoleById: userId => {
        return new Promise(function(resolve, reject) {
            let q = `SELECT role FROM users WHERE users.id = ${userId}`
            let connection = database.connect()
            connection.query(q, (err, data) => {
                connection.end()
                if (err) reject(err)
                else if (data.length > 0) resolve(data[0].role)
                else reject('User does not exist')
            })
        })
    },
    getCurrentBorrowedBooksIds: (userId) => {
        return new Promise((resolve, reject) => {
            let connection = database.connect()
            let q = 'SELECT book_id FROM \`user_borrows_book\` '+
            `WHERE user_id = ${userId} AND returned IS NULL`

            connection.query(q, (err, data) => {
                connection.end()
                if (err) {
                    console.error(err)
                    reject(err)
                }
                else resolve(data)
            })
        })
    },
    getBorrowedBooks: (userId, full = false) => {
        return new Promise((resolve, reject) => {
            let connection = database.connect()
            let q = `SELECT ub.borrowed, b.id, b.title, b.publication, b.image${ full ? ', ub.returned' : '' }`+
            ` FROM \`user_borrows_book\` AS ub INNER JOIN \`books\` AS b ON b.id = ub.book_id`+
            ` WHERE ub.user_id = ${userId}${ !full ? ' AND ub.returned IS NULL' : ' ORDER BY ub.returned DESC'}`

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
    borrowBook: (userId, bookId) => {
        return new Promise((resolve, reject) => {
            let connection = database.connect()
            let q = `INSERT INTO \`user_borrows_book\` SET ?`

            connection.query(q, { "user_id": userId, "book_id": bookId, "borrowed": getDate() }, (err, data) => {
                connection.end()
                if (err) {
                    console.error(err)
                    reject(err)
                }
                else resolve(data.insertId)
            })
        })
    },
    returnBook: (userId, bookId) => {
        return new Promise((resolve, reject) => {
            let connection = database.connect()
            let q = `UPDATE \`user_borrows_book\` AS ub SET ub.returned = ? `+
            `WHERE ub.user_id = '${userId}' AND ub.book_id = ${bookId} AND ub.returned IS NULL`

            connection.query(q, getDate(), (err, data) => {
                connection.end()
                if (err) {
                    console.error(err)
                    reject(err)
                }
                else resolve()
            })
        })
    }
}

export default Query

function getDate() {
    let now = new Date()
    return now.getFullYear()+'-'+now.getMonth()+'-'+now.getDay()
}