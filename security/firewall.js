import UserQueries from "../module/users/query";
import expressJwt from 'express-jwt'
import config from '../../config/server'

const firewall = (roles = []) => {
	// roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
	if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({ secret: config.secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            let userRole = await UserQueries.getUserRoleById(req.user.id)
            if (roles.length && !roles.includes(userRole)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

export default firewall