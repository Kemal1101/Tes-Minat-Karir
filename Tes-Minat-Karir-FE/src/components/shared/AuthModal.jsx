import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { api } from "../../lib/api";

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    nama_lengkap: "",
    username: "",
    password: ""
  });

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(loginData.username, loginData.password);
      localStorage.setItem("token", response.access_token);
      handleClose();
      setLoginData({ username: "", password: "" });
    } catch (err) {
      setError(err.message || "Login gagal. Silakan cek username dan password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.register(registerData.username, registerData.password, registerData.nama_lengkap);
      setError("");
      setShowSuccessPopup(true);
      setRegisterData({ nama_lengkap: "", username: "", password: "" });
      
      // Auto close success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setActiveTab("login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccessPopup) {
      gsap.fromTo(
        ".success-popup-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        ".success-popup-content",
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.2)",
          delay: 0.1,
        }
      );
    }
  }, [showSuccessPopup]);

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
              onSubmit={handleLoginSubmit}
            >
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-appAccent/50 transition-all text-sm text-black"
                    required
                    disabled={loading}
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
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-appAccent text-white py-4 rounded-full text-base font-bold transition-all hover:shadow-[0_8px_20px_rgba(133,72,54,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </form>
          ) : (
            <form
              key="register-form"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              onSubmit={handleRegisterSubmit}
            >
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={registerData.nama_lengkap}
                    onChange={(e) => setRegisterData({ ...registerData, nama_lengkap: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-appAccent/50 transition-all text-sm text-black"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:bg-white focus:border-appAccent focus:ring-4 focus:ring-appAccent/10 transition-all text-sm text-black"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-appAccent text-white py-3.5 rounded-full text-sm font-bold transition-all hover:shadow-[0_4px_12px_rgba(133,72,54,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Buat Akun"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const successPopupContent = showSuccessPopup && (
    <div className="success-popup-overlay fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="success-popup-content relative w-full max-w-sm mx-4 bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-black mb-2 tracking-tight">
          Berhasil Mendaftar!
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Silahkan login menggunakan akun Anda untuk melanjutkan perjalanan eksplorasi karir.
        </p>

        {/* Action Button */}
        <button
          onClick={() => {
            setShowSuccessPopup(false);
            setActiveTab("login");
          }}
          className="w-full bg-appAccent text-white py-3.5 rounded-full text-sm font-bold transition-all hover:shadow-[0_4px_12px_rgba(133,72,54,0.25)] hover:-translate-y-0.5"
        >
          Lanjut ke Login
        </button>

        {/* Auto-close indicator */}
        <p className="text-xs text-gray-400 mt-6">
          Jendela ini akan tertutup otomatis dalam beberapa detik
        </p>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && createPortal(modalContent, document.body)}
      {successPopupContent && createPortal(successPopupContent, document.body)}
    </>
  );
}
