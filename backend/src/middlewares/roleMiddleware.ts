import { Request, Response, NextFunction } from 'express';
import type { Role } from '../types/domain';

export function authorize(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos suficientes' });
    }
    return next();
  };
}
