import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PersonPlusIcon } from '../../components/icons'
import { api } from '../../lib/api'
import { clearSession, getSession } from '../../lib/session'

interface LinkedPatient {
  patientId: string
  name: string
  email: string
  linkedAt: string
}

export function DashboardPage() {
  const navigate = useNavigate()
  const session = getSession()
  const [patients, setPatients] = useState<LinkedPatient[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    api
      .get<LinkedPatient[]>('/patients')
      .then(setPatients)
      .catch(() => setLoadError(true))
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Lembra+ · Painel do cuidador
            </span>
            <h1 className="mt-4 text-3xl font-semibold">Olá, {session?.user.name}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Sair
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Pacientes vinculados</h2>
          <Link
            to="/pacientes/vincular"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline"
          >
            <PersonPlusIcon className="h-4 w-4" />
            Vincular paciente
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {loadError && (
            <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Não foi possível carregar os pacientes agora.
            </p>
          )}
          {!loadError && patients?.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Nenhum paciente vinculado ainda. Peça o código de convite dele pra vincular.
            </p>
          )}
          {patients?.map((patient) => (
            <Link
              key={patient.patientId}
              to={`/pacientes/${patient.patientId}`}
              className="block rounded-md border border-slate-200 px-3 py-3 hover:border-emerald-600"
            >
              <p className="text-sm font-semibold">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.email}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
