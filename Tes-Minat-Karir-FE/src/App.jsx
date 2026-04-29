import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { ToastProvider } from "./hooks/useToast";

// Public
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/Landing";
import TestPage from "./pages/Test";
import ResultPage from "./pages/Result";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import DaftarPengguna from "./pages/admin/DaftarPengguna";
import TestHistory from "./pages/admin/TestHistory";
import Questions from "./pages/admin/Questions";
import Occupations from "./pages/admin/Occupations";
import TokenBlacklist from "./pages/admin/TokenBlacklist";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Route>

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DaftarPengguna />} />
            <Route path="users" element={<DaftarPengguna />} />
            <Route path="history" element={<TestHistory />} />
            <Route path="questions" element={<Questions />} />
            <Route path="occupations" element={<Occupations />} />
            <Route path="blacklist" element={<TokenBlacklist />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
