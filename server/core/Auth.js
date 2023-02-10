const jwt = require('jsonwebtoken')
const {logger} = require("../config/logger");

//Általános hitelesítés
const authorization = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers['x-access-token']
        if (!token) {
            logger.warn("Authorization token nincs megadva!", {user: '', data: JSON.stringify(req.headers)})
            return res.status(401).json({message: 'Unauthorized', data: []})
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    logger.warn("Authorization token lejárt!", {user: '', data: JSON.stringify(req.headers)})
                    return res.status(401).json({message: 'Unauthorized', data: []})
                } else {
                    req.userId = decoded.userId
                    req.roles = decoded.roles
                    const rolesArray = [...allowedRoles]
                    const result = decoded.roles.map(role => rolesArray.includes(role)).find(val => val === true)
                    if (!result) {
                        logger.warn("Authorization token nincs jogosultság!", {
                            user: '',
                            data: JSON.stringify(req.headers)
                        })
                        return res.status(401).json({message: 'Unauthorized', data: []})
                    }
                    next()
                }
            })
        }
    }
}

module.exports.authorize = authorization