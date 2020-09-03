import express from "express"
import userController from "./controller"
import firewall from "../../security/firewall"

const router = express.Router()

router.post('/register', userController.register)
router.post('/authenticate', userController.authenticate)
router.post('/isAuth', userController.isAuth)
router.post('/borrow/:bookId', firewall(['user', 'admin']), userController.borrowBook)
router.get('/dashboard', firewall(['user', 'admin']), userController.dashboard)
router.put('/return/:bookId', firewall(['user', 'admin']), userController.returnBook)

export default router
