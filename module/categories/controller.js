import categoryServices from './services'

export default {
	index: (req, res) => {
		categoryServices.find()
		.then(response => res.status(response.status).send(response.payload))
		.then(err => res.status(err.status).send(err.payload))
	},
}