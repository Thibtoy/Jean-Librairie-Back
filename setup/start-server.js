import serverConfig from '../../config/server.json'

const PORT = process.env.PORT || serverConfig.PORT

const start = server => {
	console.info('Starting server')

	server.listen(PORT, error => {
		if (error) console.error('ERROR - Unable to start server:', error)
		else console.info(`INFO - Server started on http://localhost:${PORT} [DEV]`)
	})
}

export default start