import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Создание события
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Название события обязательно'),
    body('date').isISO8601().withMessage('Укажите корректную дату'),
    body('location').notEmpty().withMessage('Укажите место проведения'),
    body('creatorId').isInt().withMessage('Укажите ID создателя'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, date, location, creatorId, maxAttendees, category } = req.body;

      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          location,
          creatorId,
          maxAttendees,
          category,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании события' });
    }
  }
);

// Получение списка событий
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка событий' });
  }
});

// Регистрация на событие
router.post('/:eventId/register/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { eventId, userId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { attendees: true },
    });

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Достигнуто максимальное количество участников' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        attendees: {
          connect: { id: parseInt(userId) },
        },
      },
      include: {
        attendees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации на событие' });
  }
});

export default router; 