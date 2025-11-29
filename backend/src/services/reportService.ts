import dayjs from 'dayjs';
import { prisma } from '../utils/prisma';

type TurnosPorSectorFilter = { desde: string; hasta: string };

export async function resumenTurnosPorSector(filter: TurnosPorSectorFilter) {
  const desde = dayjs(filter.desde).startOf('day').toDate();
  const hasta = dayjs(filter.hasta).endOf('day').toDate();

  return prisma.appointment.groupBy({
    by: ['sectorId'],
    where: { fechaHoraInicio: { gte: desde, lte: hasta } },
    _count: {
      _all: true,
    },
  });
}

export async function historialUsoStock() {
  // Placeholder: en un sistema real habría tabla de movimientos.
  const criticos = await prisma.stockItem.findMany({ where: { cantidadActual: { lt: 10 } } });
  return { criticos };
}
