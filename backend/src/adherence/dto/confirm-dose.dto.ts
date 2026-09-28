import { IsIn } from 'class-validator';
import { DoseStatus } from '../../generated/prisma/enums.js';

export class ConfirmDoseDto {
  @IsIn([DoseStatus.TAKEN, DoseStatus.MISSED])
  status!: typeof DoseStatus.TAKEN | typeof DoseStatus.MISSED;
}
