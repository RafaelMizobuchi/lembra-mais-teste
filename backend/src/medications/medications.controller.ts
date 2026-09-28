import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type AuthenticatedUser, JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateMedicationDto } from './dto/create-medication.dto.js';
import { CreateScheduleDto } from './dto/create-schedule.dto.js';
import { MedicationsService } from './medications.service.js';

@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.medicationsService.findAllForPatient(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMedicationDto) {
    return this.medicationsService.create(user.userId, dto);
  }

  @Post(':id/schedules')
  addSchedule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') medicationId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.medicationsService.addSchedule(user.userId, medicationId, dto);
  }
}
