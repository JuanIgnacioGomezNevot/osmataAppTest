import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { prisma } from '../utils/prisma';
import { signToken } from '../utils/token';
import type { Role } from '../types/domain';
import { sendPasswordResetEmail } from './mailService';

type RegisterInput = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
};

export async function registerAfiliado(input: RegisterInput) {
  const exists = await prisma.user.findFirst({ where: { OR: [{ email: input.email }, { dni: input.dni }] } });
  if (exists) {
    throw new Error('El email o DNI ya se encuentra registrado');
  }

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      ...input,
      password: hashed,
      role: 'AFILIADO',
    },
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role as Role });
  return { user, token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Credenciales inválidas');
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role as Role });
  return { user, token };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  await prisma.passwordResetToken.updateMany({ where: { userId: user.id, used: false }, data: { used: true } });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = dayjs().add(1, 'hour').toDate();

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  await sendPasswordResetEmail({
    email: user.email,
    nombre: user.nombre,
    token,
  });
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      used: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!record) {
    throw new Error('El enlace de recuperación es inválido o expiró.');
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
  ]);

  return record.user;
}
