const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ msg: 'Auth Error' })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decodedToken

        next()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}