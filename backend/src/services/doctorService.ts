import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

export function listDoctors(filter?: { sectorId?: number }) {
  return prisma.doctor.findMany({
    where: { sectorId: filter?.sectorId },
    include: { sector: true },
    orderBy: { apellido: 'asc' },
  });
}

export function createDoctor(data: Prisma.DoctorCreateInput) {
  return prisma.doctor.create({ data });
}

export function updateDoctor(id: number, data: Prisma.DoctorUpdateInput) {
  return prisma.doctor.update({ where: { id }, data });
}

export function deleteDoctor(id: number) {
  return prisma.doctor.delete({ where: { id } });
}
