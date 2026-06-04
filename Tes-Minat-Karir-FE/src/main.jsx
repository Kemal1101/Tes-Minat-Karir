import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactLenis } from "lenis/react"; // Mengimpor pustaka Lenis untuk React
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Membungkus aplikasi dengan ReactLenis dan mengaktifkan mode root */}
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ReactLenis>
  </StrictMode>,
);
