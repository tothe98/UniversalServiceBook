const jwt = require('jsonwebtoken')

//Általános hitelesítés
function authenticateToken(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).json({ message: 'Unauthorized', data: [] })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized', data: [] })
            } else {
                req.userId = decoded.userId
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.workShop
                next()
            }
        })
    }
}
//Ha admin api, akkor ezt a hitelesítést kell alkalmazni
function authenticateAdmin(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).json({ message: 'Unauthorized', data: [] })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized', data: [] })
            } else if (!decoded.isAdmin) {
                res.status(403).json({ message: 'outOfRole', data: [] })
            } else {
                req.userId = decoded.userId
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.workShop
                next()

            }
        })
    }
}
//Ha szerelő api akkor ezt a hitelesítést kell alkalmazni
function authenticateWorkshop(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token) {
        res.status(401).json({ message: 'Unauthorized', data: [] })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized', data: [] })
            } else if (decoded.wid === "") {
                res.status(403).json({ message: 'outOfRole', data: [] })
            } else {
                req.userId = decoded.userId
                req.email = decoded.email
                req.isAdmin = decoded.isAdmin
                req.wid = decoded.workShop
                next()

            }
        })
    }
}

module.exports.authenticateToken = authenticateToken
module.exports.authenticateAdmin = authenticateAdmin
module.exports.authenticateWorkshop = authenticateWorkshop