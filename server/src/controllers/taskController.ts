import { Task } from '../models/models.js';

class TaskController {
    // Получение всех Task
    async getAll(req, res) {
        try {
            const tasks = await Task.findAll();
            return res.json(tasks);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch Tasks' });
        }
    }

    // Создание новой Task
    async create(req, res) {
        try {
            const { name, description, deadline } = req.body;
            
            if (!name || !description || !deadline) {
                return res.status(400).json({ message: 'Task name, description and deadline are required' });
            }

            const task = await Task.create({ name, description, deadline });
            return res.status(201).json(task);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create task' });
        }   
    }
}

export default new TaskController