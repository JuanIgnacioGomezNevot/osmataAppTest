import bcrypt from 'bcryptjs';
import type { Role } from '../types/domain';
import { prisma } from '../utils/prisma';

type UpdateProfileInput = {
  nombre?: string;
  apellido?: string;
  direccion?: string;
  ciudad?: string;
  nacionalidad?: string;
};

export async function getProfile(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { familyMembers: true },
  });
}

export async function updateProfile(userId: number, data: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      direccion: data.direccion,
      ciudad: data.ciudad,
      nacionalidad: data.nacionalidad,
    },
    include: { familyMembers: true },
  });
}

export async function listUsers(filter?: { role?: Role }) {
  return prisma.user.findMany({
    where: {
      role: filter?.role,
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      dni: true,
      email: true,
      role: true,
      estado: true,
    },
  });
}

export async function updateUserRole(userId: number, role: Role) {
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function createEmployee(data: {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
  role: Role;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error('Email ya utilizado');
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({ data: { ...data, password: hashedPassword } });
}
