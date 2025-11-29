import { mailer } from '../config/mailer';
import { env } from '../config/env';

type AppointmentMailPayload = {
  afiliadoNombre: string;
  afiliadoEmail: string;
  sector: string;
  doctor: string;
  fecha: string;
  direccion: string;
  requiereEstudios: boolean;
  comentarios?: string | null;
};

export async function sendAppointmentConfirmationEmail(payload: AppointmentMailPayload) {
  const { afiliadoNombre, afiliadoEmail, sector, doctor, fecha, direccion, requiereEstudios, comentarios } = payload;

  const complementarios = requiereEstudios
    ? '\nRecuerde traer los estudios complementarios solicitados o comunicarse con el sector para más detalles.'
    : '';

  await mailer.sendMail({
    from: env.smtp.from,
    to: afiliadoEmail,
    subject: `Confirmación de turno - ${sector}`,
    text: `Hola ${afiliadoNombre},\n\nTu turno fue confirmado:\n- Sector: ${sector}\n- Profesional: ${doctor}\n- Fecha y hora: ${fecha}\n- Dirección: ${direccion}\n${comentarios ? `Notas: ${comentarios}\n` : ''}${complementarios}\n\nGracias por confiar en el Sanatorio San Cayetano.`,
  });
}

type PasswordResetMailPayload = {
  nombre: string;
  email: string;
  token: string;
};

export async function sendPasswordResetEmail(payload: PasswordResetMailPayload) {
  const resetUrl = `${env.clientBaseUrl.replace(/\/$/, '')}/reset-password?token=${payload.token}`;
  await mailer.sendMail({
    from: env.smtp.from,
    to: payload.email,
    subject: 'Recuperá tu contraseña de OSMATA',
    text: `Hola ${payload.nombre},\n\nRecibimos una solicitud para restablecer tu contraseña. Ingresá al siguiente enlace dentro de la próxima hora:\n${resetUrl}\n\nSi no realizaste esta acción, podés ignorar este mensaje.`,
  });
}
