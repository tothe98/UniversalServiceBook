const jwt = require('jsonwebtoken')

//Általános hitelesítés
function authenticateToken(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).send('Unauthorized')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ auth: false, message: 'Nincs hitelesítve!' })
            } else {
                req.userId = decoded.userId
                req.username = decoded.username
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.wid
                next()
            }
        })
    }
}
//Ha admin api, akkor ezt a hitelesítést kell alkalmazni
function authenticateAdmin(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).send('Unauthorized')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ auth: false, message: 'Nincs hitelesítve!' })
            } else if (!decoded.isAdmin) {
                res.status(403).json({ auth: false, message: 'notAdmin' })
            } else {
                req.userId = decoded.id
                req.username = decoded.username
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.wid
                next()

            }
        })
    }
}
//Ha szerelő api akkor ezt a hitelesítést kell alkalmazni
function authenticateWorkshop(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).send('Unauthorized')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ auth: false, message: 'Nincs hitelesítve!' })
            } else if (decoded.wid === "") {
                res.status(403).json({ auth: false, message: 'notWorkshop' })
            } else {
                req.userId = decoded.id
                req.username = decoded.username
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.wid
                next()

            }
        })
    }
}

module.exports.authenticateToken = authenticateToken
module.exports.authenticateAdmin = authenticateAdmin
module.exports.authenticateWorkshop = authenticateWorkshop