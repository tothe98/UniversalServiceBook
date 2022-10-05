const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).send('Unauthorized')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ auth: false, message: 'Nincs hitelesítve!' })
            } else {
                req.userId = decoded.id
                next()
            }
        })
    }
}

module.exports.authenticateToken = authenticateToken