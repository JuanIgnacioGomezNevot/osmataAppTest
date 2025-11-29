import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function getAppointmentTypes(_req: Request, res: Response) {
  const types = await prisma.appointmentType.findMany({ orderBy: { nombre: 'asc' } });
  res.json(types);
}
