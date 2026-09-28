import { Module } from '@nestjs/common';
import { AdherenceController } from './adherence.controller.js';
import { AdherenceService } from './adherence.service.js';

@Module({
  controllers: [AdherenceController],
  providers: [AdherenceService],
})
export class AdherenceModule {}
