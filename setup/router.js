import firewall from "../security/firewall"
import usersRoutes from "../module/users/routes"
import booksRoutes from "../module/books/routes"
import categoriesRoutes from "../module/categories/routes"

const Router = server => {
	// server.use('/', (req, res) => res.status(200).send({ msg: 'coucou' }))

	server.use('/user', usersRoutes)
	server.use('/books', booksRoutes)
	server.use('/categories', categoriesRoutes)
}

export default Router
