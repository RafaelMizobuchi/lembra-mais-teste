export type Role = 'PATIENT' | 'CAREGIVER'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  patientInviteCode: string | null
}

export interface Session {
  accessToken: string
  user: SessionUser
}

const KEY = 'lembra-mais.session'

export function saveSession(session: Session) {
  localStorage.setItem('accessToken', session.accessToken)
  localStorage.setItem(KEY, JSON.stringify(session.user))
}

export function getSession(): Session | null {
  const accessToken = localStorage.getItem('accessToken')
  const rawUser = localStorage.getItem(KEY)
  if (!accessToken || !rawUser) return null

  try {
    return { accessToken, user: JSON.parse(rawUser) as SessionUser }
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem(KEY)
}
