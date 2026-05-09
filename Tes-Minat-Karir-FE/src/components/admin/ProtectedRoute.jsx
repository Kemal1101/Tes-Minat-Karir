import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const toast = useToast();

  if (!token) {
    return <Navigate to="/loginadmin" replace />;
  }

  const payload = parseJwt(token);
  
  if (!payload || payload.role !== "admin") {
    toast("Akses ditolak: Anda bukan admin", "danger");
    // Clear token if it's invalid or not admin
    localStorage.removeItem("token");
    return <Navigate to="/loginadmin" replace />;
  }

  // Token expired check
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTime) {
    toast("Sesi berakhir, silakan login kembali", "warning");
    localStorage.removeItem("token");
    return <Navigate to="/loginadmin" replace />;
  }

  return <Outlet />;
}
