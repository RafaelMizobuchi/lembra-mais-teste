import { type InputHTMLAttributes, useState } from 'react'
import { EyeIcon, EyeOffIcon } from './icons'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  wrapperClassName?: string
}

export function PasswordInput({ wrapperClassName, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`relative ${wrapperClassName ?? ''}`}>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`w-full rounded-md border border-slate-300 px-3 py-4 pr-10 text-sm text-slate-900 ${className ?? ''}`}
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-600"
      >
        {visible ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}