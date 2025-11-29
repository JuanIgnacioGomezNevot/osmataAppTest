import app from './app';
import { env } from './config/env';
import { verifyMailer } from './config/mailer';

const server = app.listen(env.port, () => {
  console.log(`API OSMATA escuchando en http://localhost:${env.port}`);
  verifyMailer();
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
