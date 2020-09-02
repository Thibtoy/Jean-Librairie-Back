import bookServices from './services'

const controller = {
	index: (req, res) => {
		bookServices.find()
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	},

	bySlug: (req, res) => {
		bookServices.find(req.params.slug)
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	}
}

export default controller