import type { ReactElement, SVGProps } from 'react'
import type { MedicationForm } from '../lib/types'
import { DropIcon, InjectionIcon, OintmentIcon, PillIcon, ShieldIcon } from './icons'

const ICONS: Record<MedicationForm, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  PILL: PillIcon,
  DROP: DropIcon,
  OINTMENT: OintmentIcon,
  INJECTION: InjectionIcon,
  OTHER: ShieldIcon,
}

export function MedicationFormIcon({
  form,
  ...props
}: { form: MedicationForm } & SVGProps<SVGSVGElement>) {
  const Icon = ICONS[form]
  return <Icon {...props} />
}
