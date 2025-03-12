import { Role } from '../models/models.js';

class RoleController {
    // Получение всех ролей
    async getAll(req, res) {
        try {
            const roles = await Role.findAll();
            return res.json(roles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch roles' });
        }
    }

    // Создание новой роли
    async create(req, res) {
        try {
            const { name } = req.body;
            
            if (!name) {
                return res.status(400).json({ message: 'Role name is required' });
            }

            const role = await Role.create({ name });
            return res.status(201).json(role);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create role' });
        }
    }
}

export default new RoleController();
