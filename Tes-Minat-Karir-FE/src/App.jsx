import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { ToastProvider } from "./hooks/useToast";

// Public
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/Landing";
import TestPage from "./pages/Test/index";
import ResultPage from "./pages/Result/index";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import DaftarPengguna from "./pages/admin/DaftarPengguna";
import TestHistory from "./pages/admin/TestHistory";
import Questions from "./pages/admin/Questions";
import Occupations from "./pages/admin/Occupations";

// Auth
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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
