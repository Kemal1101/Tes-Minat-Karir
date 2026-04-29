

// ─── BADGE ─────────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  active:   { bg: "var(--success-light)", color: "var(--success)" },
  inactive: { bg: "#F1EFE8",              color: "#5F5E5A" },
  blocked:  { bg: "var(--danger-light)",  color: "var(--danger)" },
  admin:    { bg: "var(--warning-light)", color: "var(--warning)" },
  user:     { bg: "var(--info-light)",    color: "var(--info)" },
  R: { bg: "#FCEBEB", color: "#A32D2D" },
  I: { bg: "#E6F1FB", color: "#185FA5" },
  A: { bg: "#FBEAF0", color: "#993556" },
  S: { bg: "#EAF3DE", color: "#3B6D11" },
  E: { bg: "#FAEEDA", color: "#854F0B" },
  C: { bg: "#EEEDFE", color: "#534AB7" },
};

export function Badge({ variant, children }) {
  const v = BADGE_VARIANTS[variant] || {};
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700,
      background: v.bg, color: v.color,
    }}>
      {children}
    </span>
  );
}

// ─── BUTTON ────────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: { background: "var(--app-accent)", color: "white", border: "none" },
  ghost:   { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" },
  danger:  { background: "var(--danger-light)", color: "var(--danger)", border: "none" },
  success: { background: "var(--success-light)", color: "var(--success)", border: "none" },
};

export function Button({ variant = "ghost", size = "md", onClick, children, style }) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.ghost;
  const pad = size === "sm" ? "5px 10px" : "9px 16px";
  const fs  = size === "sm" ? 11 : 13;

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: pad, borderRadius: 10,
        fontSize: fs, fontWeight: 700,
        cursor: "pointer", fontFamily: "var(--font)",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        ...v, ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.82"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, badge, badgeType = "up" }) {
  const badgeStyle = {
    up:      { bg: "var(--success-light)", color: "var(--success)" },
    neutral: { bg: "var(--info-light)",    color: "var(--info)" },
    danger:  { bg: "var(--danger-light)",  color: "var(--danger)" },
  }[badgeType] || {};

  return (
    <div style={{
      background: "var(--bg-card)", backdropFilter: "blur(12px)",
      border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
      padding: "16px 18px", transition: "all 0.2s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(133,79,11,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {badge && (
        <span style={{ display: "inline-flex", alignItems: "center", marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: badgeStyle.bg, color: badgeStyle.color }}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── SEARCH INPUT ──────────────────────────────────────────────────────────────
export function SearchInput({ placeholder, value, onChange, style }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "🔍  Cari..."}
      style={{
        padding: "7px 14px", borderRadius: 10,
        border: "1px solid var(--border)",
        background: "rgba(0,0,0,0.04)",
        fontSize: 12, fontFamily: "var(--font)",
        color: "var(--text-primary)", outline: "none",
        transition: "all 0.15s", width: 200,
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = "var(--app-accent)"; e.target.style.background = "white"; }}
      onBlur={e =>  { e.target.style.borderColor = "var(--border)";     e.target.style.background = "rgba(0,0,0,0.04)"; }}
    />
  );
}

// ─── PAGINATION ────────────────────────────────────────────────────────────────
export function Pagination({ current, total, onChange, info }) {
  return (
    <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{info}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              width: 28, height: 28, borderRadius: 8, border: "1px solid var(--border)",
              background: p === current ? "var(--app-accent)" : "transparent",
              color: p === current ? "white" : "var(--text-muted)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}

// ─── TABLE CARD ────────────────────────────────────────────────────────────────
export function TableCard({ children }) {
  return (
    <div style={{
      background: "var(--bg-card)", backdropFilter: "blur(12px)",
      border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

export function TableHeader({ title, children }) {
  return (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, fontWeight: 800 }}>{title}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{children}</div>
    </div>
  );
}

export function Table({ head, children }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children }) {
  return (
    <tr
      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", transition: "background 0.1s" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(133,79,11,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {children}
    </tr>
  );
}

export function Td({ children, muted, mono, bold, style }) {
  return (
    <td style={{
      padding: "12px 16px", fontSize: 13, verticalAlign: "middle",
      color: muted ? "var(--text-muted)" : "var(--text-primary)",
      fontFamily: mono ? "var(--mono)" : "var(--font)",
      fontWeight: bold ? 700 : 400,
      ...style,
    }}>
      {children}
    </td>
  );
}

// ─── AVATAR ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 32 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--app-accent-light)", color: "var(--app-accent)",
      fontSize: size * 0.35, fontWeight: 800,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── MONO TAG ──────────────────────────────────────────────────────────────────
export function MonoTag({ children }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 11,
      background: "#F1EFE8", padding: "3px 8px",
      borderRadius: 6, color: "#5F5E5A",
      maxWidth: 200, overflow: "hidden",
      textOverflow: "ellipsis", whiteSpace: "nowrap",
      display: "inline-block",
    }}>
      {children}
    </span>
  );
}

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
export function SectionHeader({ title, desc }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{title}</h2>
      {desc && <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{desc}</p>}
    </div>
  );
}

// ─── STATS GRID ────────────────────────────────────────────────────────────────
export function StatsGrid({ children, cols = 4 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 24 }}>
      {children}
    </div>
  );
}

// ─── FORM CONTROLS ─────────────────────────────────────────────────────────────
export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--text-primary)" }}>{label}</label>
      {children}
    </div>
  );
}

const inputBase = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid var(--border)", fontSize: 13,
  fontFamily: "var(--font)", color: "var(--text-primary)",
  background: "#F7F7F7", outline: "none", transition: "all 0.15s",
};

export function Input({ type = "text", placeholder, value, onChange, ...rest }) {
  return (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={inputBase}
      onFocus={e => { e.target.style.borderColor = "var(--app-accent)"; e.target.style.background = "white"; e.target.style.boxShadow = "0 0 0 3px rgba(133,79,11,0.08)"; }}
      onBlur={e =>  { e.target.style.borderColor = "var(--border)";     e.target.style.background = "#F7F7F7"; e.target.style.boxShadow = "none"; }}
      {...rest}
    />
  );
}

export function Select({ value, onChange, children, style }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputBase, ...style }}
      onFocus={e => { e.target.style.borderColor = "var(--app-accent)"; e.target.style.background = "white"; }}
      onBlur={e =>  { e.target.style.borderColor = "var(--border)";     e.target.style.background = "#F7F7F7"; }}
    >
      {children}
    </select>
  );
}

export function Textarea({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }}
      onFocus={e => { e.target.style.borderColor = "var(--app-accent)"; e.target.style.background = "white"; e.target.style.boxShadow = "0 0 0 3px rgba(133,79,11,0.08)"; }}
      onBlur={e =>  { e.target.style.borderColor = "var(--border)";     e.target.style.background = "#F7F7F7"; e.target.style.boxShadow = "none"; }}
    />
  );
}

export function FormGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

// ─── ALERT BANNER ─────────────────────────────────────────────────────────────
export function AlertBanner({ type = "danger", icon, title, desc }) {
  const styles = {
    danger:  { bg: "var(--danger-light)",  border: "#F7C1C1", title: "#A32D2D", desc: "#793333" },
    warning: { bg: "var(--warning-light)", border: "#FAC775", title: "var(--warning)", desc: "#633806" },
    info:    { bg: "var(--info-light)",    border: "#B5D4F4", title: "var(--info)",    desc: "#0C447C" },
  }[type];

  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.border}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: styles.title }}>{title}</div>
        <div style={{ fontSize: 12, color: styles.desc }}>{desc}</div>
      </div>
    </div>
  );
}
