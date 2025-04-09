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

      const { content, receiverId, senderId } = req.body;

      // Добавим проверку, что senderId и receiverId были переданы и являются числами
      if (!senderId || isNaN(parseInt(senderId))) {
          return res.status(400).json({ message: 'Некорректный или отсутствующий ID отправителя (senderId)' });
      }
      if (!receiverId || isNaN(parseInt(receiverId))) {
          return res.status(400).json({ message: 'Некорректный или отсутствующий ID получателя (receiverId)' });
      }

      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
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

// Создание нового чата (беседы)
router.post(
  '/create-chat',
  [
    body('userId').isInt().withMessage('Некорректный ID пользователя для создания чата'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId: targetUserId } = req.body;
      const currentUserId = req.body.userId; // ID текущего пользователя (предполагаем, что он есть)

      // Проверяем, существует ли пользователь, с которым пытаемся создать чат
      const targetUser = await prisma.user.findUnique({
        where: { id: parseInt(targetUserId) },
        select: { id: true, name: true }, // Убираем photo из select
      });

      if (!targetUser) {
        return res.status(404).json({ message: 'Пользователь для создания чата не найден' });
      }

      // В этой реализации "создание чата" просто возвращает информацию
      // о пользователе, с которым начинается чат, в формате, похожем на беседу.
      // Фронтенд ожидает объект с id, name, photo.
      // Можно добавить логику проверки существующего чата или создания записи в БД при необходимости.
      
      const conversationData = {
          id: targetUser.id, // Используем ID пользователя как ID беседы для простоты
          name: targetUser.name,
          photo: null, // Возвращаем null для фото, так как его нет в БД
          isOnline: false, // Статус 'В сети' можно будет реализовать позже
          lastMessage: '', // Пока нет сообщений
          unreadCount: 0
      };
      
      res.status(201).json(conversationData);

    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ message: 'Ошибка на сервере при создании чата' });
    }
  }
);

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