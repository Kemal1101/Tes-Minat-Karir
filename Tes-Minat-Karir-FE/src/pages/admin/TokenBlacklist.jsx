import { useState } from "react";
import { TOKEN_BLACKLIST as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  AlertBanner, Button, FormGroup, Input, MonoTag, Select,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const PAGE_SIZE = 8;
const emptyForm = { jti: "", user: "", reason: "", by: "Super Admin", blocked: "", expires: "" };

export default function TokenBlacklist() {
  const toast = useToast();
  const [data,     setData]     = useState(INITIAL);
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);

  const [formOpen,  setFormOpen]  = useState(false);
  const [deleteOpen,setDeleteOpen]= useState(false);
  const [editing,   setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [form,      setForm]      = useState(emptyForm);

  // Derived
  const filtered   = data.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.jti.toLowerCase().includes(search.toLowerCase()) ||
    t.reason.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Check if token is expired
  const isExpired = (dateStr) => {
    try { return new Date(dateStr) < new Date(); }
    catch { return false; }
  };

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(t)  { setEditing(t); setForm({ jti: t.jti, user: t.user, reason: t.reason, by: t.by, blocked: t.blocked, expires: t.expires }); setFormOpen(true); }
  function openDelete(t){ setDelTarget(t); setDeleteOpen(true); }

  function handleSave() {
    if (!form.jti || !form.user) { toast("Token JTI dan nama pengguna wajib diisi", "danger"); return; }
    if (editing) {
      setData(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast("Token blacklist diperbarui!", "success");
    } else {
      setData(prev => [{ id: Date.now(), ...form }, ...prev]);
      toast("Token berhasil di-blacklist!", "success");
    }
    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(t => t.id !== delTarget.id));
    toast("Token dihapus dari blacklist", "success");
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));

  return (
    <div>
      {/* Alert Banner */}
      {data.length > 0 && (
        <AlertBanner
          type="danger"
          icon="⚠️"
          title={`${data.length} token aktif di-blacklist`}
          desc="Token-token ini tidak dapat digunakan untuk autentikasi lebih lanjut."
        />
      )}

      <StatsGrid cols={3}>
        <StatCard label="Total Blacklist"    value={data.length}  badge="aktif"         badgeType="danger" />
        <StatCard label="Diblokir Bulan Ini" value={data.length}  badge="↑ ditambahkan" badgeType="neutral" />
        <StatCard label="Akan Kedaluwarsa"   value={1}            badge="dalam 30 hari" badgeType="warning" />
      </StatsGrid>

      <TableCard>
        <TableHeader title="Token Blacklist">
          <SearchInput placeholder="🔍  Cari token atau pengguna..." value={search} onChange={v => { setSearch(v); setPage(1); }} />
        </TableHeader>

        <Table head={["Token (JTI)", "Pengguna", "Alasan", "Diblokir Oleh", "Tanggal Blokir", "Kedaluwarsa", "Aksi"]}>
          {paginated.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)", fontSize: 13 }}>
              Tidak ada token yang di-blacklist
            </td></tr>
          ) : paginated.map(t => (
            <Tr key={t.id}>
              <Td><MonoTag>{t.jti}</MonoTag></Td>
              <Td bold>{t.user}</Td>
              <Td style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 160 }}>{t.reason}</Td>
              <Td muted style={{ fontSize: 12 }}>{t.by}</Td>
              <Td style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)" }}>{t.blocked}</Td>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.expires}</span>
                  {isExpired(t.expires) && (
                    <span style={{ background: "#F1EFE8", color: "#5F5E5A", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999 }}>
                      Kedaluwarsa
                    </span>
                  )}
                </div>
              </Td>
              <Td>
                <div style={{ display: "flex", gap: 5 }}>
                  <Button size="sm" onClick={() => openEdit(t)}>Edit</Button>
                  <Button size="sm" variant="success" onClick={() => openDelete(t)}>Hapus</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>

        <Pagination current={page} total={totalPages} onChange={setPage} info={`Menampilkan ${paginated.length} dari ${filtered.length} token`} />
      </TableCard>

      {/* ── Form Modal ── */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Token Blacklist" : "Tambah Token ke Blacklist"}
        footer={<>
          <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? "Perbarui" : "Blacklist Token"}</Button>
        </>}
      >
        <FormGroup label="Token JTI">
          <Input
            placeholder="eyJhbGciOiJIUzI1NiJ9..."
            value={form.jti}
            onChange={e => set("jti")(e.target.value)}
            style={{ fontFamily: "var(--mono)", fontSize: 11 }}
          />
        </FormGroup>
        <FormGroup label="Nama Pengguna">
          <Input placeholder="Rizki Pratama" value={form.user} onChange={e => set("user")(e.target.value)} />
        </FormGroup>
        <FormGroup label="Alasan Pemblokiran">
          <Input placeholder="Login paksa dari device lain" value={form.reason} onChange={e => set("reason")(e.target.value)} />
        </FormGroup>
        <FormGroup label="Diblokir Oleh">
          <Input value={form.by} onChange={e => set("by")(e.target.value)} />
        </FormGroup>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormGroup label="Tanggal Blokir">
            <Input type="date" value={form.blocked} onChange={e => set("blocked")(e.target.value)} />
          </FormGroup>
          <FormGroup label="Tanggal Kedaluwarsa">
            <Input type="date" value={form.expires} onChange={e => set("expires")(e.target.value)} />
          </FormGroup>
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus token dari blacklist?"
        desc="Token ini akan aktif kembali setelah dihapus dari blacklist. Pastikan token sudah kedaluwarsa atau tidak berbahaya."
      />
    </div>
  );
}
