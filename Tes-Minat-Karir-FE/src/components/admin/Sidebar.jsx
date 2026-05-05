import { NavLink } from "react-router-dom";

const menuItem = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
  color: isActive ? "#8B5E00" : "#6B7280",
  background: isActive ? "#F3E8D3" : "transparent",
  fontWeight: isActive ? 600 : 400,
  marginBottom: 6,
});

const leftContent = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const badgeStyle = {
  background: "#8B5E00",
  color: "#fff",
  borderRadius: 20,
  padding: "2px 8px",
  fontSize: 12,
  fontWeight: 600,
};

export default function Sidebar() {
  return (
    <div
      style={{
        width: 260,
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 16,
        position: "fixed",
      }}
    >
      {/* TOP */}
      <div>
        {/* Logo / Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#8B5E00",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            K
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>KarirPakar</div>
            <div style={{ fontSize: 12, color: "#888" }}>Admin Console</div>
          </div>
        </div>

        {/* SECTION: MANAJEMEN */}
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>
          MANAJEMEN
        </div>

        <NavLink to="/admin/users" style={menuItem}>
          <div style={leftContent}>👥 Daftar Pengguna</div>
          <span style={badgeStyle}>24</span>
        </NavLink>

        <NavLink to="/admin/history" style={menuItem}>
          <div style={leftContent}>📄 Test History</div>
        </NavLink>

        <NavLink to="/admin/questions" style={menuItem}>
          <div style={leftContent}>❓ Pertanyaan</div>
        </NavLink>

        <NavLink to="/admin/occupations" style={menuItem}>
          <div style={leftContent}>💼 Pekerjaan</div>
        </NavLink>

        <NavLink to="/admin/blacklist" style={menuItem}>
          <div style={leftContent}>🔒 Token Blacklist</div>
          <span style={{ ...badgeStyle, background: "#EF4444" }}>3</span>
        </NavLink>

        {/* SECTION: SISTEM */}
        <div style={{ fontSize: 12, color: "#9CA3AF", margin: "16px 0 8px" }}>
          SISTEM
        </div>

        {/* <NavLink to="/admin/settings" style={menuItem}>
          <div style={leftContent}>⚙️ Pengaturan</div>
        </NavLink> */}

        <div
          style={{
            padding: "10px 14px",
            color: "#EF4444",
            cursor: "pointer",
          }}
        >
          🚪 Keluar
        </div>
      </div>

      {/* BOTTOM USER */}
      <div
        style={{
          background: "#F3E8D3",
          borderRadius: 12,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#8B5E00",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          SA
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Super Admin</div>
          <div style={{ fontSize: 12, color: "#8B5E00" }}>
            Administrator
          </div>
        </div>
      </div>
    </div>
  );
}