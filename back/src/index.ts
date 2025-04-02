import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import messageRoutes from './routes/messageRoutes';
import socialRoutes from './routes/socialRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 3001;

// Хранилище для статистики
const visitors = new Map();

// Middleware для логирования запросов
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.socket.remoteAddress;
  console.log(`[${timestamp}] ${ip} - ${req.method} ${req.url}`);
  
  // Сохраняем информацию о посетителе
  if (!visitors.has(ip)) {
    visitors.set(ip, {
      firstVisit: timestamp,
      visits: 0,
      lastVisit: timestamp
    });
  }
  const visitorInfo = visitors.get(ip);
  visitorInfo.visits++;
  visitorInfo.lastVisit = timestamp;
  
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Маршруты
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/social', socialRoutes);

// Эндпоинт для просмотра статистики
app.get('/api/stats', (req, res) => {
  const stats = Array.from(visitors.entries()).map(([ip, info]) => ({
    ip,
    ...info
  }));
  res.json(stats);
});

// Проверка работоспособности сервера
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 