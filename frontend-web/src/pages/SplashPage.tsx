import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { getSession } from '../lib/session'

const DURATION_MS = 900

export function SplashPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()

    const interval = setInterval(() => {
      const pct = Math.min(
        100,
        Math.round(((Date.now() - start) / DURATION_MS) * 100)
      )

      setProgress(pct)

      if (pct >= 100) {
        clearInterval(interval)

        const session = getSession()
        navigate(session ? '/inicio' : '/login', { replace: true })
      }
    }, 40)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#f6f4ee] px-8 text-center">

      <Logo className="h-25 w-25" />

      <p className="mt-4 text-[38px] font-semibold text-slate-900">
        Nome <span className="text-[#004541]">Projeto</span>
      </p>

      <div className="mt-6 text-[#004541]">
        <HeartIcon className="h-10 w-10" />
      </div>

      <h1 className="mt-3 text-[33px] font-semibold text-slate-900">
        Preparando seu dia <br />
        de cuidado
      </h1>

      <p className="mt-2 text-[19px] text-slate-500">
        Frasesinha bonita que eu não
        <br />
        consigo pensar em uma agora
      </p>

      <div className="mt-10 w-full max-w-xs">

        <div className="flex justify-between text-[15px] font-semibold text-[#004541]">
          <span>Carregando...</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#004541] transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

    </main>
  )
}