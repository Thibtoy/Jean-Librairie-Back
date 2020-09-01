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
    }
}

export default userController
