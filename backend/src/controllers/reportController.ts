import { Request, Response } from 'express';
import { historialUsoStock, resumenTurnosPorSector } from '../services/reportService';

export async function getTurnosPorSector(req: Request, res: Response) {
  const { desde, hasta } = req.query as { desde: string; hasta: string };
  const data = await resumenTurnosPorSector({ desde, hasta });
  res.json(data);
}

export async function getHistorialStock(_req: Request, res: Response) {
  const data = await historialUsoStock();
  res.json(data);
}
