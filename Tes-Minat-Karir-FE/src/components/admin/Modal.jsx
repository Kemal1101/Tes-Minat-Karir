import { useEffect } from "react";
import { Button } from "../ui/UI";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const maxW = { sm: 380, md: 480, lg: 600 }[size] || 480;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`@keyframes modalIn{from{transform:scale(0.95) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.30)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "white",
            borderRadius: 20,
            padding: 24,
            width: "100%",
            maxWidth: maxW,
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: "modalIn 0.25s ease",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{title}</span>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 8, border: "none",
                background: "#F1EFE8", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-muted)", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--danger-light)"; e.currentTarget.style.color = "var(--danger)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F1EFE8";             e.currentTarget.style.color = "var(--text-muted)"; }}
            >✕</button>
          </div>

          {/* Body */}
          {children}

          {/* Footer */}
          {footer && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── CONFIRM DELETE MODAL ─────────────────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, title = "Hapus data ini?", desc = "Tindakan ini tidak dapat dibatalkan." }) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{
          width: 52, height: 52, background: "var(--danger-light)",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px", fontSize: 22,
        }}>🗑️</div>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Ya, Hapus</Button>
        </div>
      </div>
    </Modal>
  );
}
