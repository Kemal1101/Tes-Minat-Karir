import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/Landing";
// import TestPage from "./pages/Test"; // Akan dipakai nanti

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/test" element={<TestPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
