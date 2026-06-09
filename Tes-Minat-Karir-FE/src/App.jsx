import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./App.css";

import { ToastProvider } from "./hooks/useToast";

// Public
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/Landing";
import TestPage from "./pages/Test";
import ResultPage from "./pages/Result";
import DashboardPage from "./pages/Dashboard";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import DaftarPengguna from "./pages/admin/DaftarPengguna";
import TestHistory from "./pages/admin/TestHistory";
import Questions from "./pages/admin/Questions";
import Occupations from "./pages/admin/Occupations";

// Auth
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import UserProtectedRoute from "./components/shared/UserProtectedRoute";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          
          <Route path="/test" element={<TestPage />} />
          <Route path="/result" element={<ResultPage />} />
          
          <Route element={<UserProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/loginadmin" element={<LoginPage />} />

          {/* ADMIN */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DaftarPengguna />} />
              <Route path="users" element={<DaftarPengguna />} />
              <Route path="history" element={<TestHistory />} />
              <Route path="questions" element={<Questions />} />
              <Route path="occupations" element={<Occupations />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
