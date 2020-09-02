import express from "express"
import bookController from "./controller"

const router = express.Router()

router.get('/', bookController.index)
router.get('/:slug', bookController.bySlug)
// router.get('/:category', bookController.byCategory)
// router.post('/isAuth', bookController.isAuth)

export default router