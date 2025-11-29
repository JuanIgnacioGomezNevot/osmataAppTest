import { Request, Response } from 'express';
import { createSector, deleteSector, listSectors, updateSector } from '../services/sectorService';

export async function getSectors(_req: Request, res: Response) {
  const sectors = await listSectors();
  res.json(sectors);
}

export async function createSectorHandler(req: Request, res: Response) {
  const sector = await createSector(req.body);
  res.status(201).json(sector);
}

export async function updateSectorHandler(req: Request, res: Response) {
  const sector = await updateSector(Number(req.params.id), req.body);
  res.json(sector);
}

export async function deleteSectorHandler(req: Request, res: Response) {
  await deleteSector(Number(req.params.id));
  res.status(204).send();
}
