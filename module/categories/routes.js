import express from 'express'
import categoryController from './controller'

const router = express.Router()

router.get('/', categoryController.index)

export default router