import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/useToast";
import { Eye, EyeOff } from "lucide-react";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.login(username, password);
      // Simpan token ke localStorage
      localStorage.setItem("token", result.access_token);
      
      // Decode JWT manual untuk cek role (hanya untuk routing)
      const base64Url = result.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      toast("Login berhasil", "success");
      
      if (payload.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Username atau password salah");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-appBg p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-appBlob/20 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tl from-appAccent/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[28rem] relative z-10">
        <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 animate-fade-in">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-appAccent'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Masukkan username"
                  required
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/50 border rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all shadow-sm ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-appAccent focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-appAccent'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Masukkan password"
                  required
                  className={`w-full pl-11 pr-12 py-3.5 bg-white/50 border rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all shadow-sm ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-appAccent focus:bg-white'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none focus:outline-none focus:ring-0 bg-transparent border-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-appAccent text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:shadow-[0_8px_24px_rgba(133,72,54,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
