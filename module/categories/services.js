import categoryQueries from './queries'

export default {
	find: () => {
		return new Promise((resolve, reject) => {
			categoryQueries.find()
			.then(data => resolve({ status: 200, payload: { success: true, data } }))
			.catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" } }))
		})
	}
}