//import usersRoutes from "../Users/router"

const Router = server => {
	server.use('/', (req, res) => res.status(200).send({ msg: 'coucou' }))

	//server.use('/api/user', usersRoutes)
}

export default Router