import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '../../components/icons'
import { api } from '../../lib/api'

interface HistoryDoseLog {
  id: string
  medicationName: string
  scheduledFor: string
  status: 'PENDING' | 'TAKEN' | 'MISSED'
}

interface HistoryResponse {
  adherenceRate: number | null
  doseLogs: HistoryDoseLog[]
}

const STATUS_LABELS: Record<HistoryDoseLog['status'], string> = {
  PENDING: 'Pendente',
  TAKEN: 'Tomado',
  MISSED: 'Perdido',
}

const STATUS_STYLES: Record<HistoryDoseLog['status'], string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  TAKEN: 'bg-emerald-100 text-emerald-700',
  MISSED: 'bg-red-100 text-red-700',
}

const DAYS_BACK = 30

export function PatientHistoryPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!patientId) return
    const to = new Date()
    const from = new Date(to.getTime() - DAYS_BACK * 24 * 60 * 60 * 1000)
    api
      .get<HistoryResponse>(
        `/adherence/patients/${patientId}/history?from=${from.toISOString()}&to=${to.toISOString()}`,
      )
      .then(setHistory)
      .catch(() => setLoadError(true))
  }, [patientId])

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link to="/inicio" className="flex items-center gap-1 text-sm text-emerald-600 hover:underline">
          <ChevronLeftIcon className="h-4 w-4" />
          Voltar ao painel
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">Histórico de adesão</h1>
        <p className="mt-1 text-sm text-slate-500">Últimos {DAYS_BACK} dias</p>

        {loadError && (
          <p className="mt-5 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Não foi possível carregar o histórico agora.
          </p>
        )}

        {history && (
          <>
            <div className="mt-5 rounded-2xl bg-emerald-900 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Taxa de adesão
              </p>
              <p className="mt-1 text-4xl font-semibold">
                {history.adherenceRate === null ? '—' : `${history.adherenceRate}%`}
              </p>
              <p className="mt-1 text-sm text-emerald-200">
                {history.doseLogs.length} dose(s) registrada(s) no período
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {history.doseLogs.length === 0 && (
                <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  Nenhuma dose registrada nesse período ainda.
                </p>
              )}
              {history.doseLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{log.medicationName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(log.scheduledFor).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[log.status]}`}
                  >
                    {STATUS_LABELS[log.status]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
