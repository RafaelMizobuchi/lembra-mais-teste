import type { ImgHTMLAttributes } from 'react'
import logoUrl from '../assets/logo.svg'

export function Logo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={logoUrl} alt="Lembra+" {...props} />
}
