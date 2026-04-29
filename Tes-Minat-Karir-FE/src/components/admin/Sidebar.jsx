import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 16px",
  textDecoration: "none",
  color: isActive ? "#000" : "#666",
  background: isActive ? "#f3f3f3" : "transparent",
  fontWeight: isActive ? "bold" : "normal",
});

export default function Sidebar() {
  return (
    <div style={{
      width: 240,
      padding: 16,
      position: "fixed",
      height: "100vh",
      background: "#fff",
      borderRight: "1px solid #eee"
    }}>
      <h3>Admin Panel</h3>

      <NavLink to="/admin/users" style={linkStyle}>Users</NavLink>
      <NavLink to="/admin/history" style={linkStyle}>History</NavLink>
      <NavLink to="/admin/questions" style={linkStyle}>Questions</NavLink>
      <NavLink to="/admin/occupations" style={linkStyle}>Occupations</NavLink>
      <NavLink to="/admin/blacklist" style={linkStyle}>Blacklist</NavLink>
    </div>
  );
}