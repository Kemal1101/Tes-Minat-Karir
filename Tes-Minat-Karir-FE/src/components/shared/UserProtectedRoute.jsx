import { useEffect } from "react";
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

export default function UserProtectedRoute() {
  const token = localStorage.getItem("token");
  const toast = useToast();
  
  const payload = token ? parseJwt(token) : null;
  const currentTime = Math.floor(Date.now() / 1000);
  
  let redirect = null;
  let toastMsg = null;
  let toastType = null;
  let shouldClearToken = false;
  
  if (!token) {
    redirect = "/";
    toastMsg = "Anda harus login untuk mengakses halaman ini";
    toastType = "warning";
  } else if (!payload) {
    redirect = "/";
    shouldClearToken = true;
  } else if (payload.role === "admin") {
    redirect = "/admin";
    toastMsg = "Akses ditolak: Admin tidak dapat mengakses dashboard user";
    toastType = "danger";
  } else if (payload.exp && payload.exp < currentTime) {
    redirect = "/";
    toastMsg = "Sesi berakhir, silakan login kembali";
    toastType = "warning";
    shouldClearToken = true;
  }

  useEffect(() => {
    if (shouldClearToken) {
      localStorage.removeItem("token");
    }
    if (toastMsg) {
      toast(toastMsg, toastType);
    }
  }, [shouldClearToken, toastMsg, toastType, toast]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
