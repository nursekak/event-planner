import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user?: any;
}

export default function (req: CustomRequest, res, next: NextFunction) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.cookies.jwt;
        
        console.log('123 ', token)
        if (!token) {
            return res.status(401).json({ message: 'AuthMiddleware: No token' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'AuthMiddleware: Not authorized' });
    }
}
