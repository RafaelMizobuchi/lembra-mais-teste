import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type AuthenticatedUser, JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AdherenceService } from './adherence.service.js';
import { ConfirmDoseDto } from './dto/confirm-dose.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('adherence')
export class AdherenceController {
  constructor(private readonly adherenceService: AdherenceService) {}

  @Get('today')
  today(@CurrentUser() user: AuthenticatedUser) {
    return this.adherenceService.getTodayAgenda(user.userId);
  }

  @Patch('dose-logs/:id')
  confirm(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') doseLogId: string,
    @Body() dto: ConfirmDoseDto,
  ) {
    return this.adherenceService.confirmDose(user.userId, doseLogId, dto);
  }

  @Get('history')
  history(
    @CurrentUser() user: AuthenticatedUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.adherenceService.getHistory(user.userId, from, to);
  }

  @Get('patients/:patientId/history')
  historyForCaregiver(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.adherenceService.getHistoryForCaregiver(user.userId, patientId, from, to);
  }
}
