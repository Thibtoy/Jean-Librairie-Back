import bookServices from './services'

const controller = {
	index: (req, res) => {
		bookServices.getAll()
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	},

	byCategory: (req, res) => {

	}
}

export default controller