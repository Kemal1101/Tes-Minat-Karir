import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/useToast";
import { Button, FormGroup, Input } from "../../components/ui/UI";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast("Username atau password salah", "danger");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f2] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <FormGroup label="Username">
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Masukkan username" 
              required
            />
          </FormGroup>
          <FormGroup label="Password">
            <Input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Masukkan password" 
              required
            />
          </FormGroup>
          <Button 
            type="submit" 
            variant="primary" 
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
