import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MedicationForm } from '../../generated/prisma/enums.js';

export class CreateMedicationDto {
  @IsString()
  name!: string;

  @IsString()
  dosage!: string;

  @IsEnum(MedicationForm)
  form!: MedicationForm;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;
}
