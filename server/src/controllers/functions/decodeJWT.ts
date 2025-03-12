import jwt from 'jsonwebtoken'

export default function (token) {
    try {
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        console.error(error)
        return null
    }
}