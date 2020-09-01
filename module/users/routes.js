import express from "express"
import userController from "./controller"

const router = express.Router()

router.post('/register', userController.register)
router.post('/authenticate', userController.authenticate)
router.post('/isAuth', userController.isAuth)

export default router
