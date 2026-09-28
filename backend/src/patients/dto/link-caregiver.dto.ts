import { IsString } from 'class-validator';

export class LinkCaregiverDto {
  // código de convite gerado pelo paciente, ou e-mail do paciente — a decidir
  @IsString()
  patientInviteCode!: string;
}
