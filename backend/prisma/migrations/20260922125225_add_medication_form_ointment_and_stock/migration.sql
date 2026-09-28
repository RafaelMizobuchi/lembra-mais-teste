-- AlterEnum
ALTER TYPE "MedicationForm" ADD VALUE 'OINTMENT';

-- AlterTable
ALTER TABLE "medications" ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;
