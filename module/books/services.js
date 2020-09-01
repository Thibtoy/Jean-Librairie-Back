import bookQueries from './queries'

const services = {
	getAll: () => {
		return new Promise((resolve, reject) => {
			bookQueries.getAll()
			.then(data => resolve({ status: 200, payload: { success: true, data } }))
            .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" }}))
		})
	},

	byCategory: (req, res) => {

	}
}

export default services