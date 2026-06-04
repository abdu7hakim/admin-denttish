import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './admin/utils/auth'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import DoctorsManagement from './admin/pages/DoctorsManagement'
import AppointmentsManagement from './admin/pages/AppointmentsManagement'
import AdminSettings from './admin/pages/AdminSettings'
import CategoriesManagement from './admin/pages/CategoriesManagement'
import UserManagement from './admin/pages/UserManagement'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute><DoctorsManagement /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute><AppointmentsManagement /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><CategoriesManagement /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProvider>
  )
}
