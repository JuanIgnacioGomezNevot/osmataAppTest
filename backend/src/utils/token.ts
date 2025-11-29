import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { Role } from '../types/domain';

export function signToken(payload: { id: number; email: string; role: Role }) {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
}
