import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme/ThemeProvider';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignupPage from './pages/auth/SignupPage';

import SearchDoctors from './pages/public/SearchDoctors';
import SearchHospitals from './pages/public/SearchHospitals';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// V1 Overview Panes
import PatientOverview from './components/dashboards/PatientOverview';
import DoctorOverview from './components/dashboards/DoctorOverview';
import HospitalAdminOverview from './components/dashboards/HospitalAdminOverview';
import SuperAdminOverview from './components/dashboards/SuperAdminOverview';

// Generic V2 Subpages (Bookings etc)
import PatientProfile from './pages/patient/PatientProfile';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientBook from './pages/patient/PatientBook';
import PatientQueue from './pages/patient/PatientQueue';
import PatientReports from './pages/patient/PatientReports';
import ChatbotPage from './pages/patient/ChatbotPage';
import MedicalHistory from './pages/patient/MedicalHistory';
import PatientNotifications from './pages/patient/PatientNotifications';

import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorQueue from './pages/doctor/DoctorQueue';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import DoctorPatients from './pages/doctor/DoctorPatients';

import HospitalProfile from './pages/hospital/HospitalProfile';
import HospitalDepartments from './pages/hospital/HospitalDepartments';
import HospitalAppointments from './pages/hospital/HospitalAppointments';
import HospitalDoctors from './pages/hospital/HospitalDoctors';

import PlatformMetrics from './pages/admin/PlatformMetrics';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveHospitals from './pages/admin/ApproveHospitals';
import DoctorApprovals from './pages/admin/DoctorApprovals';
import AdminProfile from './pages/admin/AdminProfile';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="healthease-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignupPage />} />
                <Route path="/doctors" element={<SearchDoctors />} />
                <Route path="/hospitals" element={<SearchHospitals />} />

                <Route path="/patient/*" element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <DashboardLayout role="patient">
                      <Routes>
                        <Route path="dashboard" element={<PatientOverview />} />
                        <Route path="profile" element={<PatientProfile />} />
                        <Route path="appointments" element={<PatientAppointments />} />
                        <Route path="book" element={<PatientBook />} />
                        <Route path="queue" element={<PatientQueue />} />
                        <Route path="reports" element={<PatientReports />} />
                        <Route path="chatbot" element={<ChatbotPage />} />
                        <Route path="history" element={<MedicalHistory />} />
                        <Route path="notifications" element={<PatientNotifications />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/doctor/*" element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DashboardLayout role="doctor">
                      <Routes>
                        <Route path="dashboard" element={<DoctorOverview />} />
                        <Route path="profile" element={<DoctorProfile />} />
                        <Route path="queue" element={<DoctorQueue />} />
                        <Route path="appointments" element={<DoctorAppointments />} />
                        <Route path="availability" element={<DoctorAvailability />} />
                        <Route path="patients" element={<DoctorPatients />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/hospital/*" element={
                  <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
                    <DashboardLayout role="hospital_admin">
                      <Routes>
                        <Route path="dashboard" element={<HospitalAdminOverview />} />
                        <Route path="profile" element={<HospitalProfile />} />
                        <Route path="departments" element={<HospitalDepartments />} />
                        <Route path="appointments" element={<HospitalAppointments />} />
                        <Route path="doctors" element={<HospitalDoctors />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <DashboardLayout role="super_admin">
                      <Routes>
                        <Route path="dashboard" element={<SuperAdminOverview />} />
                        <Route path="analytics" element={<PlatformMetrics />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="hospitals" element={<ApproveHospitals />} />
                        <Route path="approvals" element={<DoctorApprovals />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
