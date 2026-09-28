import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LinkPatientPage } from './pages/caregiver/LinkPatientPage'
import { PatientHistoryPage } from './pages/caregiver/PatientHistoryPage'
import { LoginPage } from './pages/LoginPage'
import { MedicationsPage } from './pages/patient/MedicationsPage'
import { PatientHomePage } from './pages/patient/PatientHomePage'
import { NewMedicationPage } from './pages/patient/NewMedicationPage'
import { RegisterPage } from './pages/RegisterPage'
import { SplashPage } from './pages/SplashPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/cadastro" element={<RegisterPage />} />

        <Route
          path="/teste-inicio"
          element={<PatientHomePage />}
        />

        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/remedios"
          element={
            <ProtectedRoute>
              <MedicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/remedios/novo"
          element={
            <ProtectedRoute>
              <NewMedicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pacientes/vincular"
          element={
            <ProtectedRoute>
              <LinkPatientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pacientes/:patientId"
          element={
            <ProtectedRoute>
              <PatientHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App