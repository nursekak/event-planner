import ApiError from '../errors/apiError.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Role, User } from '../models/models.js';
import { Op } from 'sequelize';
dotenv.config();

const generateJwt = (id, email, roles) => {
    return jwt.sign(
        { id, email, roles },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, roles } = req.body;
    
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('User with this email already exists'));
            }
            if (!password) {
                return next(ApiError.badRequest('password is required field'));
            }
    
            const hashPassword = await bcrypt.hash(password, 5);
            console.log(roles)
            const rolesFound = await Role.findAll({
                where: { 
                    id: {
                        [Op.in]: Array.isArray(roles) ? roles : roles.split(', ')
                    }
                },
            });
            console.log('rolesFound ', rolesFound);
            if (!rolesFound.length) {
                return next(ApiError.badRequest('Some roles not found'));
            }
    
            const user = await User.create({ email, password: hashPassword });
            
            for (const role of rolesFound) {
                await user.addRole(role);
            }

            const updatedUser = await User.findOne({
                where: { id: user.id },
                include: Role,
            });

            console.log('updatedUser ', updatedUser);
            const token = generateJwt(updatedUser.id, updatedUser.email, updatedUser.roles)

            return res.json({ message: token });
        } catch (error) {
            return next(ApiError.internal('Registration error: ' + error));
        }
    }

    async login (req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}, include: Role})
            if (!user) {
                return next(ApiError.internal('User not found'))
            }
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Incorrect password'))
            }


            const token = generateJwt(user.id, user.email, user.roles)
            return res.json({ message: token });
        } catch (error) {
            res.status(400).json({message: 'Login error:' + error})
        }
    }

    async check (req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.roles)
            return res.json({token})
        } catch (error) {
            console.log(error)
        }
    }

    async getAll (req, res, next) {
        try {
            const users = await User.findAll({
                include: {
                    model: Role,
                    as: 'roles',
                    through: {
                        attributes: []
                    },
                    order: [['id', 'ASC']]
                },
                order: [['id', 'ASC']]
            })
            return res.json(users)
        } catch (error) {
            next(ApiError.internal('Get users error'))
        }
    }

}

export default new UserController()

