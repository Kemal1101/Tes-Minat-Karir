import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/admin/sidebar";
import Topbar from "../../components/shared/Topbar";
import { useToast } from "../../hooks/useToast";
import { AdminPageContext } from "../../hooks/useAdminPage";

export default function AdminLayout() {
  const toast = useToast();
  const location = useLocation();

  const [actions, setActions] = useState({
    onAdd: null,
    onRefresh: null,
  });

  return (
    <AdminPageContext.Provider value={{ setActions }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)" }}>

        {/* Sidebar */}
        <Sidebar currentPath={location.pathname} />

        {/* Main */}
        <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>

          <Topbar
            onAdd={() => actions.onAdd?.() || toast("Tidak ada aksi tambah di halaman ini", "info")}
            onRefresh={() => actions.onRefresh?.() || toast("Tidak ada aksi refresh", "info")}
          />

          <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
            <Outlet />
          </div>

        </div>
      </div>
    </AdminPageContext.Provider>
  );
}