import userQueries from "./Query"
import bcrypt from "bcrypt"
import config from "../../../config/server.json"
import jwt from "jsonwebtoken"

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
                    let token = jwt.sign({ logged: true, id: data.insertId }, config.secret, { expiresIn: 900 })
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
                        let token = jwt.sign({ logged: true, id: user.id }, config.secret, { expiresIn: 900 })
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
    }
}

export default userServices
