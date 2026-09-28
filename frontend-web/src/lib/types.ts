export type MedicationForm = 'PILL' | 'DROP' | 'OINTMENT' | 'INJECTION' | 'OTHER'

export const MEDICATION_FORM_LABELS: Record<MedicationForm, string> = {
  PILL: 'Comprimido',
  DROP: 'Gotas',
  OINTMENT: 'Pomada',
  INJECTION: 'Injeção',
  OTHER: 'Outro',
}

export interface Schedule {
  id: string
  timeOfDay: string
  daysOfWeek: number[]
}

export interface Medication {
  id: string
  name: string
  dosage: string
  form: MedicationForm
  stockQuantity: number
  schedules: Schedule[]
}

export interface DoseAgendaItem {
  doseLogId: string
  medicationName: string
  dosage: string
  timeOfDay: string
  status: 'PENDING' | 'TAKEN' | 'MISSED'
}
