import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function MainLayout() {
  return (
    <div className="bg-appBg min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
