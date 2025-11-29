import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '../utils/prisma';
import { sendAppointmentConfirmationEmail } from './mailService';
import type { AppointmentStatus, Role } from '../types/domain';

type AppointmentFindManyArgs = NonNullable<Parameters<typeof prisma.appointment.findMany>[0]>;
type AppointmentWhereInput = NonNullable<AppointmentFindManyArgs['where']>;

export async function listAvailableAppointments(params: { sectorId?: number; date?: string }) {
  const where: AppointmentWhereInput = {
    estado: 'DISPONIBLE',
  };
  if (params.sectorId) {
    where.sectorId = params.sectorId;
  }
  if (params.date) {
    const start = dayjs(params.date).startOf('day').toDate();
    const end = dayjs(params.date).endOf('day').toDate();
    where.fechaHoraInicio = { gte: start, lte: end };
  }
  return prisma.appointment.findMany({
    where,
    include: { sector: true, doctor: true, appointmentType: true },
    orderBy: { fechaHoraInicio: 'asc' },
  });
}

export async function reserveAppointment(appointmentId: number, afiliadoId: number) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { sector: true, doctor: true, appointmentType: true, afiliado: true },
    });
    if (!appointment || appointment.estado !== 'DISPONIBLE') {
      throw new Error('El turno ya no está disponible');
    }
    const updated = await tx.appointment.update({
      where: { id: appointmentId },
      data: { estado: 'RESERVADO', afiliadoId },
      include: { sector: true, doctor: true, appointmentType: true, afiliado: { select: { email: true, nombre: true } } },
    });

    if (updated.afiliado) {
      await sendAppointmentConfirmationEmail({
        afiliadoNombre: updated.afiliado.nombre,
        afiliadoEmail: updated.afiliado.email,
        sector: updated.sector.nombre,
        doctor: `${updated.doctor.nombre} ${updated.doctor.apellido}`,
        fecha: dayjs(updated.fechaHoraInicio).format('DD/MM/YYYY HH:mm'),
        direccion: 'Sanatorio San Cayetano - Av. Siempre Viva 123',
        requiereEstudios: updated.requiereEstudiosComplementarios,
        comentarios: updated.comentarios,
      });
    }
    return updated;
  });
}

export async function cancelAppointment(appointmentId: number, userId: number, role: Role) {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) {
    throw new Error('Turno inexistente');
  }
  const isOwner = appointment.afiliadoId === userId;
  const isStaff = role !== 'AFILIADO';
  if (!isOwner && !isStaff) {
    throw new Error('No puedes cancelar este turno');
  }
  if (appointment.fechaHoraInicio < new Date() && role === 'AFILIADO') {
    throw new Error('No se pueden cancelar turnos pasados');
  }
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      estado: 'DISPONIBLE',
      afiliadoId: null,
    },
  });
}

export async function listMyAppointments(userId: number) {
  return prisma.appointment.findMany({
    where: { afiliadoId: userId },
    include: { sector: true, doctor: true, appointmentType: true },
    orderBy: { fechaHoraInicio: 'desc' },
  });
}

export async function listAllAppointments(filters: {
  fecha?: string;
  sectorId?: number;
  doctorId?: number;
  estado?: AppointmentStatus;
}) {
  const where: AppointmentWhereInput = {};
  if (filters.sectorId) where.sectorId = filters.sectorId;
  if (filters.doctorId) where.doctorId = filters.doctorId;
  if (filters.estado) where.estado = filters.estado;
  if (filters.fecha) {
    const start = dayjs(filters.fecha).startOf('day').toDate();
    const end = dayjs(filters.fecha).endOf('day').toDate();
    where.fechaHoraInicio = { gte: start, lte: end };
  }
  return prisma.appointment.findMany({
    where,
    include: {
      sector: true,
      doctor: true,
      appointmentType: true,
      afiliado: { select: { nombre: true, apellido: true, dni: true } },
    },
    orderBy: { fechaHoraInicio: 'asc' },
  });
}

type AppointmentSlotInput = {
  sectorId: number;
  doctorId: number;
  appointmentTypeId: number;
  fechaHoraInicio: string;
  fechaHoraFin?: string;
  requiereEstudiosComplementarios?: boolean;
  comentarios?: string;
};

export async function createAppointmentSlot(input: AppointmentSlotInput) {
  const start = dayjs(input.fechaHoraInicio);
  if (!start.isValid()) {
    throw new Error('Fecha y hora de inicio inválidas');
  }
  const proposedEnd = input.fechaHoraFin ? dayjs(input.fechaHoraFin) : start.add(30, 'minute');
  if (!proposedEnd.isValid()) {
    throw new Error('Fecha y hora de fin inválidas');
  }
  if (!proposedEnd.isAfter(start)) {
    throw new Error('El turno debe finalizar luego de su inicio');
  }

  return prisma.appointment.create({
    data: {
      sectorId: input.sectorId,
      doctorId: input.doctorId,
      appointmentTypeId: input.appointmentTypeId,
      fechaHoraInicio: start.toDate(),
      fechaHoraFin: proposedEnd.toDate(),
      requiereEstudiosComplementarios: Boolean(input.requiereEstudiosComplementarios),
      comentarios: input.comentarios,
    },
    include: { sector: true, doctor: true, appointmentType: true },
  });
}

export async function deleteAppointmentSlot(id: number) {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new Error('Turno inexistente');
  }
  if (appointment.afiliadoId && appointment.estado === 'RESERVADO') {
    throw new Error('Este turno está reservado. Cancelalo antes de eliminarlo.');
  }

  return prisma.appointment.delete({ where: { id } });
}
