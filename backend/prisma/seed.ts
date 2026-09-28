import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { DoseStatus, MedicationForm, Role } from '../src/generated/prisma/enums.js';

// Contas de demonstração usadas na apresentação. Rodar de novo apaga e
// recria só esses dois usuários — não mexe em nenhuma outra conta do banco.
const PATIENT_EMAIL = 'maria@lembramais.app';
const CAREGIVER_EMAIL = 'joao@lembramais.app';
const DEMO_PASSWORD = 'demo1234';
const HISTORY_DAYS = 14;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function wipeDemoData() {
  const users = await prisma.user.findMany({
    where: { email: { in: [PATIENT_EMAIL, CAREGIVER_EMAIL] } },
    include: { patient: true, caregiver: true },
  });

  const patientIds = users.flatMap((u) => (u.patient ? [u.patient.id] : []));
  const caregiverIds = users.flatMap((u) => (u.caregiver ? [u.caregiver.id] : []));

  await prisma.doseLog.deleteMany({
    where: { schedule: { medication: { patientId: { in: patientIds } } } },
  });
  await prisma.schedule.deleteMany({ where: { medication: { patientId: { in: patientIds } } } });
  await prisma.medication.deleteMany({ where: { patientId: { in: patientIds } } });
  await prisma.caregiverPatient.deleteMany({
    where: { OR: [{ patientId: { in: patientIds } }, { caregiverId: { in: caregiverIds } }] },
  });
  await prisma.patient.deleteMany({ where: { id: { in: patientIds } } });
  await prisma.caregiver.deleteMany({ where: { id: { in: caregiverIds } } });
  await prisma.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
}

function doseStatusFor(dayIndex: number, doseIndex: number): DoseStatus {
  // Histórico plausível: a paciente esquece algumas doses, quase sempre as da noite.
  const missed = [
    { day: 2, dose: 1 },
    { day: 5, dose: 1 },
    { day: 9, dose: 0 },
    { day: 11, dose: 1 },
  ];
  return missed.some((m) => m.day === dayIndex && m.dose === doseIndex)
    ? DoseStatus.MISSED
    : DoseStatus.TAKEN;
}

async function main() {
  await wipeDemoData();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const patientUser = await prisma.user.create({
    data: {
      email: PATIENT_EMAIL,
      name: 'Maria Aparecida',
      role: Role.PATIENT,
      passwordHash,
      patient: { create: {} },
    },
    include: { patient: true },
  });
  const patient = patientUser.patient!;

  const caregiverUser = await prisma.user.create({
    data: {
      email: CAREGIVER_EMAIL,
      name: 'João Pedro',
      role: Role.CAREGIVER,
      passwordHash,
      caregiver: { create: {} },
    },
    include: { caregiver: true },
  });
  const caregiver = caregiverUser.caregiver!;

  await prisma.caregiverPatient.create({
    data: { caregiverId: caregiver.id, patientId: patient.id },
  });

  const medications = [
    { name: 'Losartana', dosage: '50mg', form: MedicationForm.PILL, stockQuantity: 24, times: ['08:00'] },
    { name: 'Metformina', dosage: '850mg', form: MedicationForm.PILL, stockQuantity: 41, times: ['08:00', '20:00'] },
    { name: 'Colírio lubrificante', dosage: '1 gota em cada olho', form: MedicationForm.DROP, stockQuantity: 12, times: ['12:00'] },
  ];

  const schedules: { id: string; timeOfDay: string }[] = [];
  for (const med of medications) {
    const created = await prisma.medication.create({
      data: {
        patientId: patient.id,
        name: med.name,
        dosage: med.dosage,
        form: med.form,
        stockQuantity: med.stockQuantity,
        schedules: {
          create: med.times.map((timeOfDay) => ({ timeOfDay, daysOfWeek: [] })),
        },
      },
      include: { schedules: true },
    });
    schedules.push(...created.schedules);
  }

  // Histórico dos últimos dias (sem contar hoje, que a própria agenda gera).
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let doseCount = 0;
  for (let dayIndex = HISTORY_DAYS; dayIndex >= 1; dayIndex--) {
    const day = new Date(today);
    day.setDate(day.getDate() - dayIndex);

    for (const [doseIndex, schedule] of schedules.entries()) {
      const [hours, minutes] = schedule.timeOfDay.split(':').map(Number);
      const scheduledFor = new Date(day);
      scheduledFor.setHours(hours, minutes, 0, 0);

      const status = doseStatusFor(dayIndex, doseIndex % 2);
      await prisma.doseLog.create({
        data: {
          scheduleId: schedule.id,
          scheduledFor,
          status,
          takenAt: status === DoseStatus.TAKEN ? scheduledFor : null,
        },
      });
      doseCount++;
    }
  }

  console.log('Dados de demonstração criados:');
  console.log(`  Paciente:  ${PATIENT_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`  Cuidador:  ${CAREGIVER_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`  Código de convite do paciente: ${patient.inviteCode}`);
  console.log(`  ${medications.length} medicamentos, ${schedules.length} horários, ${doseCount} doses no histórico`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
