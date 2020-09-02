import bookQueries from './queries'

const services = {
	find: (bookSlug = false) => {
		return new Promise((resolve, reject) => {
			bookQueries.find(bookSlug)
			.then(data => resolve({ status: 200, payload: { success: true, data } }))
            .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" }}))
		})
	},
}

export default services