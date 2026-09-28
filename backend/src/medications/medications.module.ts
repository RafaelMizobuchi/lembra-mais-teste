import { Module } from '@nestjs/common';
import { MedicationsController } from './medications.controller.js';
import { MedicationsService } from './medications.service.js';

@Module({
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}
