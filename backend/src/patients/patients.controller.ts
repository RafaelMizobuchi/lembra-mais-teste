import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type AuthenticatedUser, JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { LinkCaregiverDto } from './dto/link-caregiver.dto.js';
import { PatientsService } from './patients.service.js';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findForCaregiver(@CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.findPatientsForCaregiver(user.userId);
  }

  @Post('link')
  link(@CurrentUser() user: AuthenticatedUser, @Body() dto: LinkCaregiverDto) {
    return this.patientsService.linkCaregiverToPatient(user.userId, dto);
  }
}
