import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MedicationFormIcon } from '../../components/MedicationFormIcon'
import { PatientHeader } from '../../components/PatientHeader'
import { api } from '../../lib/api'
import { MEDICATION_FORM_LABELS, type Medication } from '../../lib/types'

export function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    api
      .get<Medication[]>('/medications')
      .then(setMedications)
      .catch(() => setLoadError(true))
  }, [])

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <PatientHeader />
      <div className="mx-auto max-w-md px-4 py-6">
        <Link to="/inicio" className="text-sm text-emerald-600 hover:underline">
          ‹ Volte ao início
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Meus Remédios</h1>

        <Link
          to="/remedios/novo"
          className="mt-4 block rounded-md bg-emerald-800 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-900"
        >
          + Adicionar novo remédio
        </Link>

        <div className="mt-5 space-y-2">
          {loadError && (
            <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Ainda não dá pra listar os remédios — essa parte do backend está em construção.
            </p>
          )}
          {!loadError && medications?.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Você ainda não cadastrou nenhum remédio.
            </p>
          )}
          {medications?.map((medication) => (
            <div
              key={medication.id}
              className="flex items-start gap-3 rounded-md border border-slate-200 px-3 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <MedicationFormIcon form={medication.form} className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{medication.name}</p>
                <p className="text-xs text-slate-500">
                  {medication.dosage} · {MEDICATION_FORM_LABELS[medication.form]} ·{' '}
                  {medication.stockQuantity} un. na caixa
                </p>
                {medication.schedules.length > 0 && (
                  <p className="mt-1 text-xs text-emerald-600">
                    {medication.schedules.map((s) => s.timeOfDay).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
