import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMedicationDto } from './dto/create-medication.dto.js';
import { CreateScheduleDto } from './dto/create-schedule.dto.js';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getPatientOrThrow(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new ForbiddenException('Usuário não é um paciente');
    }
    return patient;
  }

  async create(userId: string, dto: CreateMedicationDto) {
    const patient = await this.getPatientOrThrow(userId);
    return this.prisma.medication.create({
      data: {
        patientId: patient.id,
        name: dto.name,
        dosage: dto.dosage,
        form: dto.form,
        stockQuantity: dto.stockQuantity ?? 0,
      },
      include: { schedules: true },
    });
  }

  async findAllForPatient(userId: string) {
    const patient = await this.getPatientOrThrow(userId);
    return this.prisma.medication.findMany({
      where: { patientId: patient.id },
      include: { schedules: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addSchedule(userId: string, medicationId: string, dto: CreateScheduleDto) {
    const patient = await this.getPatientOrThrow(userId);
    const medication = await this.prisma.medication.findUnique({ where: { id: medicationId } });
    if (!medication || medication.patientId !== patient.id) {
      throw new NotFoundException('Medicamento não encontrado');
    }
    return this.prisma.schedule.create({
      data: { medicationId, timeOfDay: dto.timeOfDay, daysOfWeek: dto.daysOfWeek },
    });
  }
}
