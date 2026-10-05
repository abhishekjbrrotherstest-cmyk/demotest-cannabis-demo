import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dutchieRoutes from './routes/dutchieRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { sitemap, robots } from './controllers/siteController.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Render (and most hosts) sit behind a reverse proxy — trust exactly one hop so
// rate limiting sees the real client IP via X-Forwarded-For.
app.set('trust proxy', 1);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// ---- Security & parsing ----
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameSrc: ['https://dutchie.com'],
        connectSrc: ["'self'", clientUrl],
      },
    },
  })
);
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ---- Rate limit the whole API ----
app.use('/api', apiLimiter);

// ---- Health ----
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'demotest-cannabis-backend' }));

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dutchie', dutchieRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/admin', adminRoutes);

// ---- SEO files ----
app.get('/robots.txt', robots);
app.get('/sitemap.xml', sitemap);

// ---- 404 + error handling ----
app.use(notFound);
app.use(errorHandler);

export default app;