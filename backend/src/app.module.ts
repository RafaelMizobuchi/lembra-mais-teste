import { Module } from '@nestjs/common';
import { AdherenceModule } from './adherence/adherence.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { MedicationsModule } from './medications/medications.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, PatientsModule, MedicationsModule, AdherenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
