import { useToast } from "../../hooks/useToast";

export default function Topbar({ onAdd, onRefresh }) {
  const toast = useToast();
  return (
    <div style={{
      padding: "16px 24px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff"
    }}>
      <div></div>
      <div style={{ fontWeight: 700 }}>ADMIN DASHBOARD</div>
    </div>
  );
}