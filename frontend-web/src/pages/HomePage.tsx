import { Navigate } from 'react-router-dom'
import { getSession } from '../lib/session'
import { DashboardPage } from './caregiver/DashboardPage'
import { PatientHomePage } from './patient/PatientHomePage'

export function HomePage() {
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (session.user.role === 'PATIENT') {
    return <PatientHomePage />
  }

  return <DashboardPage />
}