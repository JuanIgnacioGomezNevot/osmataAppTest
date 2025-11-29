import { Request, Response } from 'express';
import { login, registerAfiliado, requestPasswordReset, resetPasswordWithToken } from '../services/authService';

export async function register(req: Request, res: Response) {
  try {
    const { user, token } = await registerAfiliado(req.body);
    res.status(201).json({ token, user: { id: user.id, nombre: user.nombre, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.json({ token, user: { id: user.id, role: user.role, nombre: user.nombre } });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  await requestPasswordReset(req.body.email);
  res.json({ message: 'Si el correo existe, te enviamos instrucciones para recuperar tu contraseña.' });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;
  try {
    await resetPasswordWithToken(token, password);
    res.json({ message: 'Tu contraseña se actualizó correctamente.' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}
