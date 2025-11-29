import { Request, Response } from 'express';
import { createDoctor, deleteDoctor, listDoctors, updateDoctor } from '../services/doctorService';

export async function getDoctors(req: Request, res: Response) {
  const doctors = await listDoctors({ sectorId: req.query.sectorId ? Number(req.query.sectorId) : undefined });
  res.json(doctors);
}

export async function createDoctorHandler(req: Request, res: Response) {
  const { sectorId, ...rest } = req.body;
  const doctor = await createDoctor({ ...rest, sector: { connect: { id: sectorId } } });
  res.status(201).json(doctor);
}

export async function updateDoctorHandler(req: Request, res: Response) {
  const { sectorId, ...rest } = req.body;
  const doctor = await updateDoctor(Number(req.params.id), {
    ...rest,
    ...(sectorId ? { sector: { connect: { id: sectorId } } } : {}),
  });
  res.json(doctor);
}

export async function deleteDoctorHandler(req: Request, res: Response) {
  await deleteDoctor(Number(req.params.id));
  res.status(204).send();
}
