import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import router from './router'
import databaseInitialisation from './database-initialisation'

const initialisation = async server => {
	console.info('Initialising application backend')
	
	server.use(bodyParser.json())
	server.use(bodyParser.urlencoded({ extended: false }))

	server.use(cookieParser())

	server.use(morgan('tiny'))

	server.use(function (req, res, next) {
		res.setHeader('Access-Control-Allow-origin', 'http://localhost:1234')
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, application/json, Authorization')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
		res.setHeader("Access-Control-Allow-Credentials", true)
		next()
	})

	router(server)

	// await databaseInitialisation()

	console.info('Application backend successfully initialised')
}

export default initialisation