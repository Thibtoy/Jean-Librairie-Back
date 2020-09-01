import usersRoutes from "../module/users/routes"

const Router = server => {
	// server.use('/', (req, res) => res.status(200).send({ msg: 'coucou' }))

	server.use('/user', usersRoutes)
}

export default Router
