import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Cambio123', 10);

  const [admin, empleado, afiliado] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@osmata.com' },
      update: {},
      create: {
        nombre: 'Ana',
        apellido: 'Admin',
        dni: '20000000',
        email: 'admin@osmata.com',
        password,
        role: 'ADMIN',
        ciudad: 'Buenos Aires',
        nacionalidad: 'Argentina',
      },
    }),
    prisma.user.upsert({
      where: { email: 'empleado@osmata.com' },
      update: {},
      create: {
        nombre: 'Emilio',
        apellido: 'Empleado',
        dni: '30000000',
        email: 'empleado@osmata.com',
        password,
        role: 'EMPLEADO',
        ciudad: 'Buenos Aires',
        nacionalidad: 'Argentina',
      },
    }),
    prisma.user.upsert({
      where: { email: 'afiliado@osmata.com' },
      update: {},
      create: {
        nombre: 'Agustina',
        apellido: 'Afiliada',
        dni: '40000000',
        email: 'afiliado@osmata.com',
        password,
        role: 'AFILIADO',
        ciudad: 'La Plata',
        nacionalidad: 'Argentina',
      },
    }),
  ]);

  const sectors = await prisma.$transaction([
    prisma.sector.upsert({
      where: { id: 1 },
      update: {},
      create: { nombre: 'Odontología', descripcion: 'Consultorios planta baja' },
    }),
    prisma.sector.upsert({
      where: { id: 2 },
      update: {},
      create: { nombre: 'Traumatología', descripcion: '2do piso' },
    }),
    prisma.sector.upsert({
      where: { id: 3 },
      update: {},
      create: { nombre: 'Cirugía', descripcion: 'Quirófanos centrales' },
    }),
  ]);

  const appointmentTypes = await prisma.$transaction([
    prisma.appointmentType.upsert({ where: { nombre: 'Consulta' }, update: {}, create: { nombre: 'Consulta' } }),
    prisma.appointmentType.upsert({ where: { nombre: 'Control' }, update: {}, create: { nombre: 'Control' } }),
    prisma.appointmentType.upsert({ where: { nombre: 'Estudio' }, update: {}, create: { nombre: 'Estudio' } }),
  ]);

  const doctors = await prisma.$transaction([
    prisma.doctor.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nombre: 'Lucía',
        apellido: 'Dentista',
        matricula: 'OD12345',
        email: 'ldentista@sancayetano.com',
        especialidad: 'Odontología',
        sectorId: sectors[0].id,
      },
    }),
    prisma.doctor.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nombre: 'Matías',
        apellido: 'Trauma',
        matricula: 'TR54321',
        email: 'mtrauma@sancayetano.com',
        especialidad: 'Traumatología',
        sectorId: sectors[1].id,
      },
    }),
  ]);

  const now = dayjs();
  const appointmentPromises = [];
  for (let i = 1; i <= 6; i += 1) {
    const start = now.add(i, 'day').hour(9 + (i % 3)).minute(0).second(0);
    appointmentPromises.push(
      prisma.appointment.create({
        data: {
          sectorId: sectors[i % sectors.length].id,
          doctorId: doctors[i % doctors.length].id,
          appointmentTypeId: appointmentTypes[i % appointmentTypes.length].id,
          fechaHoraInicio: start.toDate(),
          fechaHoraFin: start.add(30, 'minute').toDate(),
          comentarios: i % 2 === 0 ? 'Traer estudios previos' : null,
          requiereEstudiosComplementarios: i % 2 === 0,
          estado: i % 3 === 0 ? 'RESERVADO' : 'DISPONIBLE',
          afiliadoId: i % 3 === 0 ? afiliado.id : null,
        },
      })
    );
  }
  await Promise.all(appointmentPromises);

  await prisma.stockItem.createMany({
    data: [
      {
        nombre: 'Guantes quirúrgicos',
        categoria: 'CIRUGIA',
        descripcion: 'Guantes esterilizados',
        cantidadActual: 120,
        unidadMedida: 'pares',
        stockMinimo: 50,
        ubicacion: 'Depósito central',
      },
      {
        nombre: 'Anestesia odontológica',
        categoria: 'ODONTOLOGIA',
        descripcion: 'Cartuchos 1.8ml',
        cantidadActual: 25,
        unidadMedida: 'cartuchos',
        stockMinimo: 30,
        ubicacion: 'Farmacia',
      },
    ],
  });

  console.log('Datos seed generados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
