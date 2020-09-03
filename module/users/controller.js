import userServices from "./service"

const userController = {
	register: (req, res) => {
		userServices
			.register(req.body)
			.then(response => {
				res.cookie("token", response.token, {
					maxAge: 900000,
					httpOnly: true,
					secure: false
				})
				res.cookie("connected", true, { maxAge: 900000, secure: false })
				res.status(response.status).send(response.token)
			})
			.catch(err => res.status(err.status).send(err))
	},
	authenticate: (req, res) => {
		userServices
			.authenticate(req.body)
			.then(response => {
				res.cookie("token", response.token, {
					maxAge: 900000,
					httpOnly: true,
					secure: false
				})
				res.cookie("connected", true, { maxAge: 900000, secure: false })
				res.status(response.status).send(response.token)
			})
			.catch(err => res.status(err.status).send(false))
    },
    isAuth: (req, res) => {
        let token = req.cookies.token
        if (token) {
            userServices
                .isAuth(token)
                .then(response => {
                    if (response.payload.token)
                        res.cookie("token", response.payload.token, {
                            maxAge: 900000,
                            httpOnly: true,
                            secure: false
                        })
                    res.cookie("connected", true, { maxAge: 900000, secure: false })
                    res.status(response.status).send(response.payload.token)
                })
                .catch(err => res.status(err.status).send(err))
        }
        else res.status(200).send({ status: 200, payload: { success: false, message: "You must be logged in to access this section"}})
    },
	borrowBook: (req, res) => {
		userServices.borrowBook(req.params.bookId, req.user.id)
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	},
	dashboard: (req, res) => {
		userServices.dashboard(req.user.id)
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	},
	returnBook: (req, res) => {
		userServices.returnBook(req.params.bookId, req.user.id)
		.then(response => res.status(response.status).send(response.payload))
		.catch(err => res.status(err.status).send(err.payload))
	}	
}

export default userController
