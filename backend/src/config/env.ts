import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'fallback-secret';
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./dev.db';

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Sanatorio San Cayetano <no-reply@sancayetano.com>',
  },
  clientBaseUrl: process.env.BASE_CLIENT_URL || 'http://localhost:5173',
};
