import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/auth.routes';
import medicineRoutes from './server/routes/medicine.routes';
import trackerRoutes from './server/routes/tracker.routes';
import aiRoutes from './server/routes/ai.routes';

import { loggerMiddleware } from './server/middleware/logger';
import { errorHandler } from './server/middleware/errorHandler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Development logger
  app.use(loggerMiddleware);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/medicines', medicineRoutes);
  app.use('/api/trackers', trackerRoutes);
  app.use('/api/ai', aiRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Integrate Vite for Frontend SPA
  if (process.env.NODE_ENV !== 'production') {
    console.log('[CareSync] Running in development mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[CareSync] Running in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error boundary handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CareSync] Server online at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CareSync] Server startup failure:', err);
});
