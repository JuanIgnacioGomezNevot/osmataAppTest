import { Request, Response } from 'express';
import type { Role } from '../types/domain';
import { getProfile, updateProfile, listUsers, updateUserRole, createEmployee } from '../services/userService';

export async function getMe(req: Request, res: Response) {
  const profile = await getProfile(req.user!.id);
  res.json(profile);
}

export async function updateMe(req: Request, res: Response) {
  const profile = await updateProfile(req.user!.id, req.body);
  res.json(profile);
}

export async function adminListUsers(req: Request, res: Response) {
  const { role } = req.query;
  const users = await listUsers({ role: role as Role | undefined });
  res.json(users);
}

export async function changeRole(req: Request, res: Response) {
  const updated = await updateUserRole(Number(req.params.id), req.body.role);
  res.json(updated);
}

export async function createStaff(req: Request, res: Response) {
  const user = await createEmployee({ ...req.body, role: req.body.role as Role });
  res.status(201).json(user);
}
