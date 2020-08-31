import databaseConf from "../../config/database.json"
import mysql from "mysql2"

export const databaseName = databaseConf.database;

export const database = {
  	connect: () => mysql.createConnection(databaseConf, err => {
      if (err) throw err;
    }),
}

export const noDatabase = {
	connect: () => mysql.createConnection(
		{
			host: databaseConf.host,
			user: databaseConf.user,
			password: databaseConf.password,
			port: databaseConf.port || "3306",
    		socketPath: databaseConf.socketPath || null
		},
		err => {
			if (err) throw err;
		}
	),
}