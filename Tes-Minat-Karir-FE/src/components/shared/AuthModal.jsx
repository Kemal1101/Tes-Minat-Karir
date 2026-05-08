import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".auth-modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        ".auth-modal-content",
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.2)",
          delay: 0.1,
        },
      );
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(".auth-modal-content", {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(".auth-modal-overlay", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const modalContent = (
    <div className="auth-modal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      <div className="auth-modal-content relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">
            RIASEC.
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Selamat datang di portal eksplorasi karir
          </p>
        </div>

        <div className="flex bg-gray-50/80 border border-gray-100 p-1.5 rounded-full mb-10 shadow-inner">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "login"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "register"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Daftar
          </button>
        </div>

        <div className="relative">
          {activeTab === "login" ? (
            <form
              key="login-form"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-appAccent/50 transition-all text-sm text-black"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-[10px] font-bold text-appAccent hover:underline"
                    >
                      Lupa?
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-appAccent text-white py-4 rounded-full text-base font-bold transition-all hover:shadow-[0_8px_20px_rgba(133,72,54,0.3)] hover:-translate-y-1"
              >
                Masuk Sekarang
              </button>
            </form>
          ) : (
            <form
              key="register-form"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-appAccent/50 transition-all text-sm text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-appAccent text-white py-3.5 rounded-full text-sm font-bold transition-all hover:shadow-[0_4px_12px_rgba(133,72,54,0.25)] hover:-translate-y-0.5"
              >
                Buat Akun
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
