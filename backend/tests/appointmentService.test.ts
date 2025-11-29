import { beforeEach, describe, expect, it, jest as jestMock } from '@jest/globals';

type JestFn = ReturnType<typeof jestMock.fn>;
import dayjs from 'dayjs';
import { reserveAppointment, cancelAppointment } from '../src/services/appointmentService';
import { prisma } from '../src/utils/prisma';
import { sendAppointmentConfirmationEmail } from '../src/services/mailService';

jestMock.mock('../src/services/mailService', () => ({
  sendAppointmentConfirmationEmail: jestMock.fn(),
}));

jestMock.mock('../src/utils/prisma', () => {
  const appointment = {
    findUnique: jestMock.fn(),
    update: jestMock.fn(),
    findMany: jestMock.fn(),
    create: jestMock.fn(),
  };
  return {
    prisma: {
      appointment,
      $transaction: jestMock.fn(async (cb: any) => cb({ appointment })),
    },
  };
});

const prismaMock = prisma as unknown as {
  appointment: {
    findUnique: JestFn;
    update: JestFn;
    findMany: JestFn;
    create: JestFn;
  };
};

describe('appointmentService', () => {
  beforeEach(() => {
    jestMock.clearAllMocks();
  });

  it('impide cancelar un turno si no pertenece al afiliado', async () => {
    const future = dayjs().add(1, 'day').toDate();
    prismaMock.appointment.findUnique.mockResolvedValue({
      id: 1,
      afiliadoId: 10,
      fechaHoraInicio: future,
    });

    await expect(cancelAppointment(1, 20, 'AFILIADO')).rejects.toThrow('No puedes cancelar este turno');
  });

  it('envía correo al reservar un turno disponible', async () => {
    const future = dayjs().add(2, 'day').toDate();
    prismaMock.appointment.findUnique.mockResolvedValue({
      id: 2,
      estado: 'DISPONIBLE',
      sector: { nombre: 'Odontología' },
      doctor: { nombre: 'Lucía', apellido: 'Dentista' },
      appointmentType: { nombre: 'Consulta' },
      afiliado: null,
    });
    prismaMock.appointment.update.mockResolvedValue({
      id: 2,
      fechaHoraInicio: future,
      requiereEstudiosComplementarios: false,
      comentarios: null,
      sector: { nombre: 'Odontología' },
      doctor: { nombre: 'Lucía', apellido: 'Dentista' },
      appointmentType: { nombre: 'Consulta' },
      afiliado: { nombre: 'Agustina', email: 'afiliado@osmata.com' },
    });

    await reserveAppointment(2, 10);

    expect(sendAppointmentConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ afiliadoNombre: 'Agustina', sector: 'Odontología' })
    );
  });
});
