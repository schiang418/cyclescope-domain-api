import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://cyclescope-portal-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint (REST)
app.get('/health', (req, res) => {
  const hasDatabase = !!process.env.DATABASE_URL;
  const hasOpenAI = !!process.env.OPENAI_API_KEY && !!process.env.OPENAI_ASSISTANT_ID;

  res.json({
    status: 'ok',
    service: 'CycleScope Domain API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: hasDatabase ? 'connected' : 'not connected',
    openai: hasOpenAI ? 'configured' : 'not configured',
  });
});

// tRPC endpoint
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Serve static files (generated HTML pages)
app.use('/domains', express.static('public/domains'));

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('✅ CycleScope Domain API running');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌐 Server:        http://localhost:${PORT}`);
  console.log(`📊 Health check:  http://localhost:${PORT}/health`);
  console.log(`🔌 tRPC endpoint: http://localhost:${PORT}/api/trpc`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Phase 1: Project Setup - COMPLETE ✅');
  console.log('⏳ Phase 2: Database Schema - TODO');
  console.log('');
});

