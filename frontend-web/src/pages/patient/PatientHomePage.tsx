import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BellIcon, CheckIcon } from '../../components/icons'
import { PatientHeader } from '../../components/PatientHeader'
import { api } from '../../lib/api'
import { getSession } from '../../lib/session'
import type { DoseAgendaItem } from '../../lib/types'

function greeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatToday() {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const DOT_COLORS = [
  'bg-amber-500',
  'bg-sky-500',
  'bg-violet-500',
]

export function PatientHomePage() {
  const session = getSession()

  const [doses, setDoses] = useState<DoseAgendaItem[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    api
      .get<DoseAgendaItem[]>('/adherence/today')
      .then(setDoses)
      .catch(() => setLoadError(true))
  }, [])

  const next = doses?.find((d) => d.status === 'PENDING')

  const rest = (doses ?? []).filter(
    (d) => d.doseLogId !== next?.doseLogId,
  )

  async function confirmNext() {
    if (!next) return

    setConfirming(true)

    try {
      await api.patch(
        `/adherence/dose-logs/${next.doseLogId}`,
        { status: 'TAKEN' },
      )

      setDoses(
        (prev) =>
          prev?.map((d) =>
            d.doseLogId === next.doseLogId
              ? { ...d, status: 'TAKEN' }
              : d,
          ) ?? null,
      )
    } catch {
      // silencioso por enquanto
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className="min-h-svh bg-white text-[#4E4E4E]">
      
      {/* HEADER */}
      <PatientHeader />

      {/* CONTEÚDO MOBILE */}
      <div className="mx-auto w-full max-w-[390px] px-[22px] pt-[22px]">

        {/* INÍCIO */}
        <p className="font-['Epilogue'] text-[15px] font-semibold text-[#4E4E4E]">
          Início
        </p>

        {/* DATA */}
        <p className="mt-[16px] font-['Epilogue'] text-[18px] font-bold text-[#004541]">
          {formatToday()}
        </p>

        {/* SAUDAÇÃO */}
        <h1 className="mt-[15px] font-['Epilogue'] text-[33px] font-semibold leading-[38px] text-[#4E4E4E]">
          <span className="block">
            {greeting()},
          </span>

          <span className="block">
            {session?.user.name?.split(' ')[0] ?? 'Paciente'}!
          </span>
        </h1>

        {/* FRASE */}
        <p className="mt-[23px] font-['Epilogue'] text-[16px] font-normal leading-[23px] text-[#5E5E5E]">
          Cada novo dia é uma nova oportunidade de cuidar de você.
          <br />
          Vá com calma, siga seu ritmo e não se esqueça de se cuidar.
        </p>

        {/* QUADRO PRINCIPAL */}
        <div className="mt-[23px] w-full rounded-[4px] bg-[#B7B7B7] px-[20px] py-[27px]">

          {/* CABEÇALHO DO QUADRO */}
          <div className="flex w-full items-start justify-between gap-[12px]">

            {/* BOTÃO VERDE */}
            <div className="flex h-[62px] min-w-0 flex-1 items-center rounded-[36px] bg-[#004541] px-[18px]">

              <BellIcon className="h-[28px] w-[28px] shrink-0 text-white" />

              <div className="ml-[12px] leading-[21px]">
                <span className="block font-['Epilogue'] text-[19px] font-extrabold text-white">
                  Próximo
                </span>

                <span className="block font-['Epilogue'] text-[19px] font-extrabold text-white">
                  Medicamento
                </span>
              </div>

            </div>

            {/* TEMPO */}
            <span className="mt-[16px] shrink-0 font-['Epilogue'] text-[15px] font-bold leading-[18px] text-[#004541]">
              Em 15
              <br />
              minutos
            </span>

          </div>

          {/* CONTEÚDO DO PRÓXIMO MEDICAMENTO */}
          {next && (
            <div className="mt-[27px]">

              <p className="font-['Epilogue'] text-[13px] font-semibold text-[#4E4E4E]">
                Nome do remédio
              </p>

              <p className="mt-[3px] break-words font-['Epilogue'] text-[22px] font-bold text-[#004541]">
                {next.medicationName}
              </p>

              <p className="mt-[3px] font-['Epilogue'] text-[14px] text-[#5E5E5E]">
                Dose: {next.dosage}
              </p>

              <button
                type="button"
                onClick={confirmNext}
                disabled={confirming}
                className="mt-[18px] flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-['Epilogue'] text-[14px] font-semibold text-[#004541] disabled:opacity-60"
              >
                <CheckIcon className="h-4 w-4" />

                {confirming
                  ? 'Confirmando…'
                  : 'Já tomei este remédio'}
              </button>

            </div>
          )}

          {/* NENHUM MEDICAMENTO */}
          {!loadError && doses?.length === 0 && (
            <p className="mt-[27px] font-['Epilogue'] text-[14px] leading-[20px] text-[#5E5E5E]">
              Nenhum remédio cadastrado ainda.
            </p>
          )}

          {/* ERRO */}
          {loadError && (
            <p className="mt-[27px] font-['Epilogue'] text-[14px] leading-[20px] text-[#5E5E5E]">
              Ainda não dá para carregar a agenda do dia.
            </p>
          )}

        </div>

        {/* RESTANTE DA AGENDA */}
        {rest.length > 0 && (
          <section className="mt-6">

            <div className="flex items-center justify-between gap-3">

              <h2 className="font-['Epilogue'] text-sm font-semibold text-[#4E4E4E]">
                Próximos do dia
              </h2>

              <Link
                to="/remedios"
                className="shrink-0 font-['Epilogue'] text-sm font-medium text-[#004541] underline underline-offset-2"
              >
                Ver agenda completa
              </Link>

            </div>

            <div className="mt-2 space-y-2">

              {rest.map((dose, i) => (
                <div
                  key={dose.doseLogId}
                  className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2"
                >

                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      DOT_COLORS[i % DOT_COLORS.length]
                    }`}
                  />

                  <span className="shrink-0 font-['Epilogue'] text-sm font-semibold">
                    {dose.timeOfDay}
                  </span>

                  <div className="min-w-0">

                    <p className="truncate font-['Epilogue'] text-sm font-medium">
                      {dose.medicationName}
                    </p>

                    <p className="font-['Epilogue'] text-xs text-slate-500">
                      {dose.dosage}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* ADICIONAR MEDICAMENTO */}
        <Link
          to="/remedios/novo"
          className="mt-6 mb-6 block w-full rounded-xl bg-[#004541] py-3 text-center font-['Epilogue'] text-sm font-semibold text-white hover:bg-[#003834]"
        >
          + Adicionar novo remédio
        </Link>

      </div>

    </main>
  )
}

