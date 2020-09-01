import database from "../../setup/database"

const Query = {
    register: (user) => {
        return new Promise(function(resolve, reject) {
            let q = `INSERT INTO users (username, email, password) VALUES (`+
            `'${user.username}', '${user.email}', '${user.password}');`
            let connection = database.connect()
            connection.query(q, (err, data) => {
                connection.end()
                if (err) {
                    console.log(err)
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
    }
}

export default Query
