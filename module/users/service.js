import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import config from "../../../config/server.json"
import userQueries from "./query"
import bookServices from "../books/services"

const refreshToken = decoded => {
	let now = new Date()
	let remainingTime =
		decoded.exp - parseInt(now.getTime().toString().slice(0, 10), 10)
	if (remainingTime < 420) {
		return jwt.sign({ logged: true, id: decoded.id }, config.secret, {
			expiresIn: 900
		})
	} else return false
}

const userServices = {
	register: body => {
		return new Promise((resolve, reject) => {
			const { username, email, password } = body
			if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string")
				reject({ status: 400, payload: { success: false, message: "All fields are required and must be a string type" }})
			bcrypt
				.genSalt()
                .then(salt => bcrypt.hash(password, salt))
                .then(hashedPassword => userQueries.register({ username, email, password: hashedPassword }))
				.then(data => {
                    let token = jwt.sign({ logged: true, id: data.insertId, role: 'user' }, config.secret, { expiresIn: 900 })
                    resolve({status: 201, token})
                })
                .catch(err => reject({ status: 401, payload: { success: false, message: "Login error, check your informations" }}))
		})
    },
    authenticate: body => {
        return new Promise((resolve, reject) => {
            const { email, password } = body
            if (typeof email !== "string" || typeof password !== "string")
                reject({ status: 400, payload: { success, message: "All fields are required and must be a string type"}})
                userQueries.getUser(body)
                    .then(async user => {
                        if (!await bcrypt.compare(password, user.password))
                            reject({ status: 400, payload: { success: false, message: "Wrong password"}})
                        let token = jwt.sign({ logged: true, id: user.id, role: user.role }, config.secret, { expiresIn: 900 })
                        delete user.password
                        resolve({ status: 200, token })
                    })
                    .catch(err => reject({ status: 400, payload: { success: false, message: err }}))
        })
    },
    isAuth: token => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err)
                    reject({ status: 200, payload: { success: false, message: "Connection expired, please reconnect to access this section"}})
                else {
                    let token = refreshToken(decoded)
                    resolve({ status: 200, payload: { success: true, id: decoded.id, token }})
                }
                })
        })
    },
    borrowBook: (bookId, userId) => {
        return new Promise(async (resolve, reject) => {
            let currentBorrowedBooksIds = await userQueries.getCurrentBorrowedBooksIds(userId)
            .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" } }))
            let bookIsDisponible = await bookServices.bookIsDisponible(bookId)
            .catch(err => {
                console.error(err)
                reject({ status: 500, payload: { success: false, message: "Internal Server Error" } })
            })

            if (bookIsDisponible) {
                if (currentBorrowedBooksIds.length < 5) {
                    if (!currentBorrowedBooksIds.find(item => item['book_id'] === bookId)) {
                        await userQueries.borrowBook(userId, bookId)
                        .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" } }))

                        resolve({ status: 201, payload: { success: true, message: 'Book successfully borrowed' } })
                    }
                    else resolve({ status: 200, payload: { success: false, message: 'You already have borrowed this book'}})
                }
                else resolve({ status: 200, payload: { success: false, message: 'You have already borrow 5 books, return some of thems before to borrow another one!'}})
            }
            else resolve({ status: 200, payload: { success: false, message: 'Is actually not disponible, retry in a few days'}})
        })
    },
    dashboard: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await userQueries.getUserById(userId)
                user.currentBorrowedBooks = await userQueries.getBorrowedBooks(userId)
                user.historyBorrowedBooks = await userQueries.getBorrowedBooks(userId, true)

                resolve({ status: 200, payload: { success: true, user } })
            }
            catch (error) {
                console.log(error)
                reject({ status: 500, payload: { success: false, message: "Internal Server Error" } })
            }
        })
    },
    returnBook: (bookId, userId) => {
        return new Promise((resolve, reject) => {
            userQueries.returnBook(userId, bookId)
            .then(() => resolve({ status: 204 }))
            .catch(error => {
                console.error(error)
                reject({ status: 500, payload: { success: false, message: "Internal Server Error" } })
            })
        })
    }
}

export default userServices
