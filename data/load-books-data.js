import { database } from '../setup/database'
import axios from 'axios'

export default async () => {
	await axios.get('https://www.googleapis.com/books/v1/volumes?q=les-miserables')
	.then(async res => {
		await res.data.items.forEach(async item => {
			console.log(item.volumeInfo)
		})
	})
	.catch(err => console.log(err))
}
