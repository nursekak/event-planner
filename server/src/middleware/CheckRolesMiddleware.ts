import jwt from 'jsonwebtoken';

export default function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {

            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({ message: 'No Token' })
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const decodedRoles = decoded.roles.map(role => role)
            let hasPermission = false
            decodedRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasPermission = true
                }
            })
            // let hasRole = roles.some(role => decoded.roles.include(role))

            if (!hasPermission) {
                return res.status(403).json({ message: 'Access is denied' })
            }
            req.user = decoded
            next()
        } catch (error) {
            console.error(error)
            return res.status(401).json({ message: 'Not authorized' })
        }
    }
}
