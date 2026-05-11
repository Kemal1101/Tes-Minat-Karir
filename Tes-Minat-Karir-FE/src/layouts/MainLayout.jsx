import { Outlet } from "react-router-dom";
import { ReactLenis } from "lenis/react";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function MainLayout() {
  return (
    <ReactLenis root>
      <Navbar />
      <Outlet />
      <Footer />
    </ReactLenis>
  );
}
