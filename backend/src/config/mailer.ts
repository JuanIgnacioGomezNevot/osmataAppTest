import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type JSONTransport from 'nodemailer/lib/json-transport';
import { env } from './env';

const isStubTransport = !env.smtp.host || env.smtp.host.includes('example.com');
const transportConfig: SMTPTransport.Options | JSONTransport.Options = isStubTransport
  ? {
      jsonTransport: true,
    }
  : {
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user
        ? {
            user: env.smtp.user,
            pass: env.smtp.pass,
          }
        : undefined,
    };

export const mailer = nodemailer.createTransport(transportConfig);

export async function verifyMailer(): Promise<void> {
  if (isStubTransport) {
    console.log('SMTP en modo stub: los correos se imprimirán como JSON sin enviarse.');
    return;
  }

  try {
    await mailer.verify();
    console.log('SMTP listo para enviar correos');
  } catch (error) {
    console.warn('No se pudo verificar el transporte SMTP', error);
  }
}
