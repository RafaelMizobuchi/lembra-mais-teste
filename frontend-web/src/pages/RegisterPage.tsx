import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, HeartIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { PasswordInput } from '../components/PasswordInput'
import { api, ApiError } from '../lib/api'
import { type Session, saveSession } from '../lib/session'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    try {
      // Cadastro público sempre cria conta de paciente — um cuidador entra
      // por convite de um paciente já cadastrado (ver seção "vínculo").
      const session = await api.post<Session>('/auth/register', {
        name,
        email,
        password,
        role: 'PATIENT',
      })
      saveSession(session)
      navigate('/inicio')
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError('Não foi possível conectar ao servidor. Tente novamente em instantes.')
      } else if (err instanceof ApiError && err.status === 409) {
        setError('Esse e-mail já está cadastrado.')
      } else {
        setError('Não foi possível criar sua conta. Tente novamente.')
      }
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center bg-white px-6 py-8">
      <div className="flex w-full max-w-sm items-center gap-2">
        <Link to="/login" className="text-slate-500">
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <Logo className="h-7 w-7" />
        <span className="text-sm font-semibold">Nome Projeto</span>
      </div>

      <div className="mt-4 w-full max-w-sm">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckIcon className="h-3.5 w-3.5" />
          Cadastro Simples &amp; Seguro
        </span>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Criar nova conta
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Leve apenas alguns segundos para começar a organizar sua saúde
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-900 px-4 py-3 text-white">
          <HeartIcon className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Cuidado com afeto e clareza</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block text-sm font-medium text-slate-700">
            Nome completo
            <span className="mt-0.5 block text-xs font-normal text-slate-400">
              Como prefere ser chamado?
            </span>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Anne da Silva Junior"
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </label>

          <label className="mt-3 block text-sm font-medium text-slate-700">
            E-mail principal
            <span className="mt-0.5 block text-xs font-normal text-slate-400">
              Para receber lembretes e confirmar suas receitas
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: seuemail@gmail.com"
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </label>

          <label className="mt-3 block text-sm font-medium text-slate-700" htmlFor="password">
            Senha
            <span className="mt-0.5 block text-xs font-normal text-slate-400">
              Pelo menos 8 letras ou números
            </span>
          </label>
          <PasswordInput
            id="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            wrapperClassName="mt-1.5"
          />

          <label
            className="mt-3 block text-sm font-medium text-slate-700"
            htmlFor="confirmPassword"
          >
            Confirmar senha
            <span className="mt-0.5 block text-xs font-normal text-slate-400">
              Pelo menos 8 letras ou números
            </span>
          </label>
          <PasswordInput
            id="confirmPassword"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita sua senha"
            wrapperClassName="mt-1.5"
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            <ArrowRightIcon className="h-4 w-4" />
            Criar minha conta
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline"
            >
              Fazer login
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
