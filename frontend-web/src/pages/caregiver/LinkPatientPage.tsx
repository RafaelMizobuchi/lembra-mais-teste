import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, PersonPlusIcon } from '../../components/icons'
import { api } from '../../lib/api'

export function LinkPatientPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await api.post('/patients/link', { patientInviteCode: code.trim() })
      navigate('/inicio')
    } catch {
      setError('Código inválido, ou esse paciente já está vinculado a você.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center bg-white px-6 py-10">
      <div className="flex w-full max-w-sm items-center gap-2">
        <Link to="/inicio" className="text-slate-500">
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <span className="text-sm font-semibold">Voltar ao painel</span>
      </div>

      <PersonPlusIcon className="mt-6 h-10 w-10 text-emerald-800" />
      <h1 className="mt-3 text-xl font-semibold text-slate-900">Vincular um paciente</h1>
      <p className="mt-1 max-w-xs text-center text-sm text-slate-500">
        Peça pro paciente abrir a conta dele e te passar o código de convite.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
        <label className="block text-sm font-medium text-slate-700">
          Código de convite
          <input
            id="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cole o código aqui"
            className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full rounded-md bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
        >
          {saving ? 'Vinculando…' : 'Vincular paciente'}
        </button>
      </form>
    </main>
  )
}
