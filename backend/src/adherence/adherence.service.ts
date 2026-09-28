import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DoseStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfirmDoseDto } from './dto/confirm-dose.dto.js';

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

@Injectable()
export class AdherenceService {
  constructor(private readonly prisma: PrismaService) {}

  private async getPatientOrThrow(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new ForbiddenException('Usuário não é um paciente');
    }
    return patient;
  }

  async getTodayAgenda(userId: string) {
    const patient = await this.getPatientOrThrow(userId);
    const now = new Date();
    const weekday = now.getDay();
    const today = startOfDay(now);

    const medications = await this.prisma.medication.findMany({
      where: { patientId: patient.id },
      include: { schedules: true },
    });

    const items = [];
    for (const medication of medications) {
      for (const schedule of medication.schedules) {
        if (schedule.daysOfWeek.length > 0 && !schedule.daysOfWeek.includes(weekday)) {
          continue;
        }

        const [hours, minutes] = schedule.timeOfDay.split(':').map(Number);
        const scheduledFor = new Date(today);
        scheduledFor.setHours(hours, minutes, 0, 0);

        // Sem o job de notificações (issue à parte), o DoseLog do dia é
        // criado aqui mesmo, na primeira vez que a agenda é consultada.
        let doseLog = await this.prisma.doseLog.findFirst({
          where: { scheduleId: schedule.id, scheduledFor },
        });
        doseLog ??= await this.prisma.doseLog.create({
          data: { scheduleId: schedule.id, scheduledFor },
        });

        items.push({
          doseLogId: doseLog.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          timeOfDay: schedule.timeOfDay,
          status: doseLog.status,
        });
      }
    }

    return items.sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));
  }

  async confirmDose(userId: string, doseLogId: string, dto: ConfirmDoseDto) {
    const patient = await this.getPatientOrThrow(userId);
    const doseLog = await this.prisma.doseLog.findUnique({
      where: { id: doseLogId },
      include: { schedule: { include: { medication: true } } },
    });
    if (!doseLog || doseLog.schedule.medication.patientId !== patient.id) {
      throw new NotFoundException('Dose não encontrada');
    }

    return this.prisma.doseLog.update({
      where: { id: doseLogId },
      data: {
        status: dto.status,
        takenAt: dto.status === DoseStatus.TAKEN ? new Date() : null,
      },
    });
  }

  async getHistory(userId: string, fromISO: string, toISO: string) {
    const patient = await this.getPatientOrThrow(userId);
    return this.computeHistory(patient.id, fromISO, toISO);
  }

  async getHistoryForCaregiver(
    userId: string,
    patientId: string,
    fromISO: string,
    toISO: string,
  ) {
    const caregiver = await this.prisma.caregiver.findUnique({ where: { userId } });
    if (!caregiver) {
      throw new ForbiddenException('Usuário não é um cuidador');
    }

    const link = await this.prisma.caregiverPatient.findUnique({
      where: { caregiverId_patientId: { caregiverId: caregiver.id, patientId } },
    });
    if (!link) {
      throw new ForbiddenException('Paciente não vinculado a este cuidador');
    }

    return this.computeHistory(patientId, fromISO, toISO);
  }

  private async computeHistory(patientId: string, fromISO: string, toISO: string) {
    const doseLogs = await this.prisma.doseLog.findMany({
      where: {
        schedule: { medication: { patientId } },
        scheduledFor: { gte: new Date(fromISO), lte: new Date(toISO) },
      },
      include: { schedule: { include: { medication: true } } },
      orderBy: { scheduledFor: 'asc' },
    });

    const taken = doseLogs.filter((d) => d.status === DoseStatus.TAKEN).length;

    return {
      adherenceRate: doseLogs.length === 0 ? null : Math.round((taken / doseLogs.length) * 100),
      doseLogs: doseLogs.map((d) => ({
        id: d.id,
        medicationName: d.schedule.medication.name,
        scheduledFor: d.scheduledFor,
        status: d.status,
      })),
    };
  }
}
