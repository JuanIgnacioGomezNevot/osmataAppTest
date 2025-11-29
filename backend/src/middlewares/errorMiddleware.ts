import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  return res.status(500).json({ message: err.message || 'Error interno del servidor' });
}
