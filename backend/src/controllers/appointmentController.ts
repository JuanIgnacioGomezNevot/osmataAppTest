import { Request, Response } from 'express';
import type { AppointmentStatus } from '../types/domain';
import {
  listAvailableAppointments,
  reserveAppointment,
  cancelAppointment,
  listMyAppointments,
  listAllAppointments,
  createAppointmentSlot,
  deleteAppointmentSlot,
} from '../services/appointmentService';

export async function getAvailableAppointments(req: Request, res: Response) {
  const sectorId = req.query.sectorId ? Number(req.query.sectorId) : undefined;
  const date = req.query.fecha as string | undefined;
  const appointments = await listAvailableAppointments({ sectorId, date });
  res.json(appointments);
}

export async function reserve(req: Request, res: Response) {
  const role = req.user!.role;
  const isAfiliado = role === 'AFILIADO';
  const targetAfiliadoId = isAfiliado ? req.user!.id : req.body.afiliadoId;
  if (!targetAfiliadoId) {
    return res.status(400).json({ message: 'Debes indicar el afiliado para reservar este turno.' });
  }
  const appointment = await reserveAppointment(Number(req.params.id), targetAfiliadoId);
  res.json(appointment);
}

export async function cancel(req: Request, res: Response) {
  const appointment = await cancelAppointment(Number(req.params.id), req.user!.id, req.user!.role);
  res.json(appointment);
}

export async function myAppointments(req: Request, res: Response) {
  const appointments = await listMyAppointments(req.user!.id);
  res.json(appointments);
}

export async function adminAppointments(req: Request, res: Response) {
  const filters = {
    fecha: req.query.fecha as string | undefined,
    sectorId: req.query.sectorId ? Number(req.query.sectorId) : undefined,
    doctorId: req.query.doctorId ? Number(req.query.doctorId) : undefined,
    estado: req.query.estado as AppointmentStatus | undefined,
  };
  const appointments = await listAllAppointments(filters);
  res.json(appointments);
}

export async function createAppointment(req: Request, res: Response) {
  const appointment = await createAppointmentSlot({
    sectorId: Number(req.body.sectorId),
    doctorId: Number(req.body.doctorId),
    appointmentTypeId: Number(req.body.appointmentTypeId),
    fechaHoraInicio: req.body.fechaHoraInicio,
    fechaHoraFin: req.body.fechaHoraFin,
    requiereEstudiosComplementarios: req.body.requiereEstudiosComplementarios,
    comentarios: req.body.comentarios,
  });
  res.status(201).json(appointment);
}

export async function deleteAppointment(req: Request, res: Response) {
  await deleteAppointmentSlot(Number(req.params.id));
  res.status(204).send();
}
