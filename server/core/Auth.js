const jwt = require('jsonwebtoken')

//Általános hitelesítés
const authorization = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers['x-access-token']
        if (!token) {
            return res.status(401).json({message: 'Unauthorized', data: []})
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({message: 'Unauthorized', data: []})
                } else {
                    req.userId = decoded.userId
                    req.roles = decoded.roles
                    const rolesArray = [...allowedRoles]
                    const result = decoded.roles.map(role => rolesArray.includes(role)).find(val => val === true)
                    if (!result) {
                        return res.status(401).json({message: 'Unauthorized', data: []})
                    }
                    next()
                }
            })
        }
    }
}

module.exports.authorize = authorization