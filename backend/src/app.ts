import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env';
import router from './routes';
import { errorHandler } from './middlewares/errorMiddleware';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(cors({ origin: env.clientBaseUrl.split(','), credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);
setupSwagger(app);
app.use(errorHandler);

export default app;
