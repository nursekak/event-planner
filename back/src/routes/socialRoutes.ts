import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Создание поста
router.post(
  '/posts',
  [
    body('content').notEmpty().withMessage('Содержание поста не может быть пустым'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;
      const authorId = req.body.userId; // В реальном приложении получаем из токена

      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании поста' });
    }
  }
);

// Получение ленты постов
router.get('/feed', async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.body.userId; // В реальном приложении получаем из токена

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: 3,
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          where: {
            userId: parseInt(userId),
          },
          take: 1,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении ленты' });
  }
});

// Добавление комментария
router.post(
  '/posts/:postId/comments',
  [
    body('content').notEmpty().withMessage('Комментарий не может быть пустым'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { postId } = req.params;
      const { content } = req.body;
      const authorId = req.body.userId; // В реальном приложении получаем из токена

      const comment = await prisma.comment.create({
        data: {
          content,
          postId: parseInt(postId),
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании комментария' });
    }
  }
);

// Лайк/анлайк поста
router.post('/posts/:postId/like', async (req: express.Request, res: express.Response) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId; // В реальном приложении получаем из токена

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: parseInt(postId),
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId: parseInt(postId),
          userId,
        },
      });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обработке лайка' });
  }
});

// Подписка/отписка
router.post('/users/:userId/follow', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const followerId = req.body.userId; // В реальном приложении получаем из токена

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId: parseInt(userId),
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      res.json({ following: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId,
          followingId: parseInt(userId),
        },
      });
      res.json({ following: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обработке подписки' });
  }
});

export default router; 