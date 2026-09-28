import { IsArray, IsInt, IsString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'timeOfDay deve estar no formato HH:mm' })
  timeOfDay!: string;

  // 0 (domingo) a 6 (sábado); vazio = todo dia
  @IsArray()
  @IsInt({ each: true })
  daysOfWeek!: number[];
}
