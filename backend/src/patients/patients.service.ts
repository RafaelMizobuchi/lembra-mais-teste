import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LinkCaregiverDto } from './dto/link-caregiver.dto.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPatientsForCaregiver(caregiverUserId: string) {
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { userId: caregiverUserId },
      include: {
        patients: {
          include: { patient: { include: { user: true } } },
        },
      },
    });

    if (!caregiver) {
      throw new ForbiddenException('Usuário não é um cuidador');
    }

    return caregiver.patients.map((link) => ({
      patientId: link.patient.id,
      name: link.patient.user.name,
      email: link.patient.user.email,
      linkedAt: link.createdAt,
    }));
  }

  async linkCaregiverToPatient(caregiverUserId: string, dto: LinkCaregiverDto) {
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { userId: caregiverUserId },
    });
    if (!caregiver) {
      throw new ForbiddenException('Usuário não é um cuidador');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { inviteCode: dto.patientInviteCode },
    });
    if (!patient) {
      throw new NotFoundException('Código de convite inválido');
    }

    const existingLink = await this.prisma.caregiverPatient.findUnique({
      where: { caregiverId_patientId: { caregiverId: caregiver.id, patientId: patient.id } },
    });
    if (existingLink) {
      throw new ConflictException('Vínculo já existe');
    }

    return this.prisma.caregiverPatient.create({
      data: { caregiverId: caregiver.id, patientId: patient.id },
    });
  }
}
