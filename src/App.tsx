import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import MedicalRecords from './pages/MedicalRecords'
import Billing from './pages/Billing'
import Pharmacy from './pages/Pharmacy'
import Imaging from './pages/Imaging'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import type { Role } from './data/mock'

export interface CurrentUser {
  name: string
  workId: string
  account: string
  role: Role
}

function App() {
  const [role, setRole] = useState<Role>('doctor')
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ name: '陈志明', workId: 'U001', account: 'doctor1', role: 'doctor' })
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <HashRouter>
        <Routes>
          <Route path="*" element={<Login onLogin={(user) => { setCurrentUser(user); setRole(user.role); setLoggedIn(true) }} />} />
        </Routes>
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout role={role} currentUser={currentUser} />}>
          <Route path="/dashboard" element={<Dashboard role={role} />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/records" element={<MedicalRecords />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/imaging" element={<Imaging />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
