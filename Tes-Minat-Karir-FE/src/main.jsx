import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactLenis } from "lenis/react"; // Mengimpor pustaka Lenis untuk React
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { api } from "./lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // Cache bertahan 1 jam agar tidak refetch berulang
      refetchOnWindowFocus: false,
    },
  },
});

// Prefetch data soal segera saat web pertama kali dimuat di background (Tanpa menunggu user masuk ke Test)
queryClient.prefetchQuery({
  queryKey: ['publicQuestions'],
  queryFn: async () => {
    const res = await api.getPublicQuestions();
    return res.data || res;
  }
});

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
