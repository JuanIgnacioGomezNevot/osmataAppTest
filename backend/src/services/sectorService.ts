import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

export function listSectors() {
  return prisma.sector.findMany({ orderBy: { nombre: 'asc' } });
}

export function createSector(data: Prisma.SectorCreateInput) {
  return prisma.sector.create({ data });
}

export function updateSector(id: number, data: Prisma.SectorUpdateInput) {
  return prisma.sector.update({ where: { id }, data });
}

export function deleteSector(id: number) {
  return prisma.sector.delete({ where: { id } });
}
