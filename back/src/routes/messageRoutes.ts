import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Отправка сообщения
router.post(
  '/send',
  [
    body('content').notEmpty().withMessage('Сообщение не может быть пустым'),
    body('receiverId').isInt().withMessage('Некорректный получатель'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, receiverId } = req.body;
      const senderId = req.body.userId; // В реальном приложении получаем из токена

      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при отправке сообщения' });
    }
  }
);

// Получение списка сообщений с пользователем
router.get('/conversation/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.body.userId; // В реальном приложении получаем из токена

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: parseInt(currentUserId) },
              { receiverId: parseInt(userId) },
            ],
          },
          {
            AND: [
              { senderId: parseInt(userId) },
              { receiverId: parseInt(currentUserId) },
            ],
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении сообщений' });
  }
});

// Получение списка последних чатов
router.get('/chats', async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.body.userId; // В реальном приложении получаем из токена

    const chats = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      distinct: ['senderId', 'receiverId'],
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка чатов' });
  }
});

// Отметить сообщения как прочитанные
router.post('/read/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.body.userId; // В реальном приложении получаем из токена

    await prisma.message.updateMany({
      where: {
        senderId: parseInt(userId),
        receiverId: parseInt(currentUserId),
        read: false,
      },
      data: {
        read: true,
      },
    });

    res.json({ message: 'Сообщения отмечены как прочитанные' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении статуса сообщений' });
  }
});

export default router; 