export default function Topbar({ onAdd, onRefresh }) {
  return (
    <div style={{
      padding: 16,
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      background: "#fff"
    }}>
      <div style={{ fontWeight: 700 }}>Admin Dashboard</div>

      <div>
        <button onClick={onRefresh} style={{ marginRight: 8 }}>
          Refresh
        </button>
        <button onClick={onAdd}>
          Add
        </button>
      </div>
    </div>
  );
}