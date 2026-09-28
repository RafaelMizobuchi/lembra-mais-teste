import { type KeyboardEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MedicationFormIcon } from '../../components/MedicationFormIcon'
import { PatientHeader } from '../../components/PatientHeader'
import { api } from '../../lib/api'
import { MEDICATION_FORM_LABELS, type Medication, type MedicationForm } from '../../lib/types'

const FORMS: MedicationForm[] = ['PILL', 'DROP', 'OINTMENT', 'INJECTION']

export function NewMedicationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [form, setForm] = useState<MedicationForm | null>(null)
  const [times, setTimes] = useState<string[]>([])
  const [timeInput, setTimeInput] = useState('')
  const [stockQuantity, setStockQuantity] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function addTime() {
    if (/^\d{2}:\d{2}$/.test(timeInput) && !times.includes(timeInput)) {
      setTimes((t) => [...t, timeInput].sort())
    }
    setTimeInput('')
  }

  function handleTimeKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTime()
    }
  }

  const canSubmit = name.trim() && dosage.trim() && form && times.length > 0

  async function handleSubmit() {
    if (!canSubmit || !form) return
    setError(null)
    setSaving(true)
    try {
      const medication = await api.post<Medication>('/medications', {
        name,
        dosage,
        form,
        stockQuantity,
      })
      await Promise.all(
        times.map((timeOfDay) =>
          api.post(`/medications/${medication.id}/schedules`, { timeOfDay, daysOfWeek: [] }),
        ),
      )
      navigate('/remedios')
    } catch {
      setError(
        'Não foi possível salvar agora — o cadastro de remédios no backend ainda está em construção.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <PatientHeader />
      <div className="mx-auto max-w-md px-4 py-6">
        <Link to="/inicio" className="text-sm text-emerald-600 hover:underline">
          ‹ Volte ao início
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Cadastrar remédio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe seus remédios cadastrados e horários
        </p>

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="text-sm font-semibold">1. Nome do remédio</h2>
            <p className="text-xs text-slate-500">
              Digite o nome destacado na caixa
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Dipirona"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold">2. Qual a dose?</h2>
            <p className="text-xs text-slate-500">
              A quantidade recomendada pelo médico
            </p>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ex: 50mg, 1 comprimido, 10 gotas"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold">3. Tipo de remédio</h2>
            <p className="text-xs text-slate-500">
              Selecione tocando em uma das opções
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FORMS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setForm(f)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium ${
                    form === f
                      ? 'border-emerald-700 bg-emerald-900 text-white'
                      : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <MedicationFormIcon form={f} className="h-4 w-4" />
                  {MEDICATION_FORM_LABELS[f]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold">4. Horários do dia</h2>
            <p className="text-xs text-slate-500">
              Quando o alarme deve tocar no celular
            </p>
            {times.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {times.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 rounded-full bg-emerald-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTimes((prev) => prev.filter((x) => x !== t))}
                      aria-label={`Remover horário ${t}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                onKeyDown={handleTimeKeyDown}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={addTime}
                className="rounded-md border border-emerald-700 px-3 text-sm font-semibold text-emerald-700"
              >
                Adicionar
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold">5. Quantas doses há na caixa?</h2>
            <p className="text-xs text-slate-500">
              Quantas doses o paciente consegue com a quantidade atual comprada?
            </p>
            <div className="mt-2 flex items-center justify-center gap-4 rounded-md border border-slate-300 py-2">
              <button
                type="button"
                onClick={() => setStockQuantity((q) => Math.max(0, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg"
              >
                −
              </button>
              <span className="w-20 text-center text-sm font-semibold">
                {stockQuantity} Unidades
              </span>
              <button
                type="button"
                onClick={() => setStockQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900 text-lg text-white"
              >
                +
              </button>
            </div>
          </section>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-md bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {saving ? 'Salvando…' : 'Salvar remédio'}
        </button>
      </div>
    </main>
  )
}
