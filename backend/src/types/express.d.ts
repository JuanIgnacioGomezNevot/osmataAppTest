import type { Role } from './domain';

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      role: Role;
      email: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
