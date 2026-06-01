import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import TeacherDashboard from './pages/TeacherDashboard'
import PrincipalDashboard from './pages/PrincipalDashboard'
import StudentView from './pages/StudentView'
import PublicDashboard from './pages/PublicDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Routes:
        <Route path="/dashboard" element={<PublicDashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/principal" element={<PrincipalDashboard />} />
        <Route path="/live/:teacherId" element={<StudentView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App