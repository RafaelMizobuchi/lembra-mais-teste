import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowBracketIcon, LockIcon, MailIcon, PersonPlusIcon, ShieldIcon } from '../components/icons'
import { PasswordInput } from '../components/PasswordInput'
import { api, ApiError } from '../lib/api'
import { type Session, saveSession } from '../lib/session'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    try {
      const session = await api.post<Session>('/auth/login', { email, password })
      saveSession(session)
      navigate('/inicio')
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError('Não foi possível conectar ao servidor. Tente novamente em instantes.')
      } else {
        setError('E-mail ou senha inválidos.')
      }
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center bg-white px-6 py-10">
      <div>
        <img
          src="/icone_maleta.svg"
          alt="Logo Lembra+"
          className="h-22 w-22"
        />
      </div>

      <span className="mt-2 flex items-center gap-1.5 rounded-full bg-[#B4EFDB] px-3.5 py-1 text-[11px] font-bold text-[#004541]">
        <ShieldIcon className="h-[11px] w-[11px]" />
        Ambiente seguro &amp; acessível
      </span>

      <h1 className="mt-4 text-[24px] font-[800] font-['Abhaya_Libre'] text-[#004541]">
        Que bom ter você aqui!
      </h1>

      <p className="mt-[15px] w-[280px] text-center text-[16px] font-['Abhaya_Libre'] leading-[18px] text-[#808080]">
        Acesse sua conta com calma
        <br />
        e facilidade para acompanhar suas
        <br />
        medicações.
      </p>
      <form onSubmit={handleSubmit} className="mt-[65px] w-full max-w-sm">

        <label className="flex items-center gap-1.5 font-[800] text-[17px] font-['Abhaya_Libre'] text-[#004541]">
          <MailIcon className="h-6 w-6 text-[#004541]" />
          E-mail cadastrado
        </label>

        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex: nome@gmail.com"
          className="mt-2.5 w-full px-3 py-4 text-sm font-semibold text-slate-900 font-['Abhaya_Libre'] shadow-[6px_6px_5px_rgba(0,0,0,0.25)]"
        />

        <span className="mt-2 block text-[13px] font-semibold font-['Abhaya_Libre'] leading-[16px] text-slate-600">
          Digite o e-mail que você ou sua
          <br />
          família cadastrada
        </span>

        <div className="mt-[43px]">
          <label
            htmlFor="password"
            className="flex items-center gap-1.5 font-[800] text-[17px] font-['Abhaya_Libre'] text-[#004541]"
          >
            <LockIcon className="h-6 w-6 text-[#004541]" />
            Sua senha
          </label>

          <PasswordInput
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            wrapperClassName="mt-2.5"
            className="font-semibold font-['Abhaya_Libre'] shadow-[6px_6px_5px_rgba(0,0,0,0.25)]"
          />

          <div className="mt-2 flex items-start justify-between">
            <span className="w-[150px] text-[13px] font-semibold font-['Abhaya_Libre'] leading-[16px] text-slate-600">
              Mantenha sua senha em
              <br />
              segredo
            </span>

            <Link
              to="#"
              className="ml-auto text-left text-[13px] font-['Abhaya_Libre'] font-semibold leading-[16px] text-[#004541] underline underline-offset-3 decoration-2"
            >
              Esqueci minha
              <br />
              senha
            </Link>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-[53px] text-[18px] flex w-full items-center font-['Abhaya_Libre'] font-medium justify-center gap-2 rounded-xl bg-[#004541] py-3 text-sm font-semibold text-white hover:bg-[#004540]"
        >
          <ArrowBracketIcon className="h-6 w-6" />
          Entrar na sua conta
        </button>

        <p className="my-[27px] text-center text-xs text-slate-400">
          ou
        </p>

        <Link
          to="/cadastro"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <PersonPlusIcon className="h-4 w-4" />
          Criar nova conta
        </Link>

      </form>
    </main>
  )
}