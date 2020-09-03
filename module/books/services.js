import bookQueries from './queries'

const services = {
	find: (bookSlug = false) => {
		return new Promise((resolve, reject) => {
			bookQueries.find(bookSlug)
			.then(data => resolve({ status: 200, payload: { success: true, data } }))
            .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" } }))
		})
	},

	findByCategory: (categorySlug = false) => {
		return new Promise((resolve, reject) => {
			bookQueries.findByCategory(categorySlug)
			.then(data => resolve({ status: 200, payload: { success: true, data } }))
            .catch(err => reject({ status: 500, payload: { success: false, message: "Internal Server Error" } }))
		})
	},
	bookIsDisponible: (bookId) => {
		return new Promise((resolve, reject) => {
			bookQueries.getRemaningBooks(bookId)
			.then(data => {
				if (!data) resolve(false)
				else resolve((data.nbOfBorrow < data.quantity)? true : false)
			})
	        .catch(err => reject(err))
		})
	}
}

export default services