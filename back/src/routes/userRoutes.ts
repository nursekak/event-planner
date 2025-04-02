import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Регистрация пользователя
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
    body('name').notEmpty().withMessage('Имя обязательно'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      const user = await prisma.user.create({
        data: {
          email,
          password, // В реальном приложении пароль нужно хешировать
          name,
        },
      });

      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
  }
);

// Получение списка пользователей
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
  }
});

// Вход пользователя
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').notEmpty().withMessage('Введите пароль'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: 'Неверный email или пароль' });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: 'Неверный email или пароль' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при входе' });
    }
  }
);

export default router; 