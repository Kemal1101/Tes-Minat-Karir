import { useState } from "react";
import { TEST_HISTORY as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Avatar, Badge, Button, FormGroup, FormGrid, Input, Select,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const RIASEC_TYPES = ["R", "I", "A", "S", "E", "C"];
const RIASEC_STYLE = {
  R: { bg: "#FCEBEB", color: "#A32D2D" },
  I: { bg: "#E6F1FB", color: "#185FA5" },
  A: { bg: "#FBEAF0", color: "#993556" },
  S: { bg: "#EAF3DE", color: "#3B6D11" },
  E: { bg: "#FAEEDA", color: "#854F0B" },
  C: { bg: "#EEEDFE", color: "#534AB7" },
};

function RiasecBadge({ letter }) {
  const s = RIASEC_STYLE[letter] || {};
  return (
    <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, marginRight: 2 }}>
      {letter}
    </span>
  );
}

const PAGE_SIZE = 8;
const emptyForm = { user: "", type: "SAI", saw: "0.80", cf: "0.75", career: "", date: "" };

export default function TestHistory() {
  const toast  = useToast();
  const [data,   setData]   = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const [formOpen,   setFormOpen]   = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [viewing,    setViewing]    = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  // Derived
  const filtered   = data.filter(h => h.user.toLowerCase().includes(search.toLowerCase()) || h.career.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgSAW  = data.reduce((a, h) => a + h.saw, 0) / data.length || 0;
  const dominant = Object.entries(
    data.reduce((acc, h) => { const t = h.type[0]; acc[t] = (acc[t]||0)+1; return acc; }, {})
  ).sort((a,b) => b[1]-a[1])[0]?.[0] || "—";

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(h)  { setEditing(h); setForm({ user: h.user, type: h.type, saw: h.saw.toString(), cf: h.cf.toString(), career: h.career, date: h.date }); setFormOpen(true); }
  function openDetail(h){ setViewing(h); setDetailOpen(true); }
  function openDelete(h){ setDelTarget(h); setDeleteOpen(true); }

  function handleSave() {
    if (!form.user || !form.career) { toast("Pengguna dan karir wajib diisi", "danger"); return; }
    const entry = { ...form, saw: parseFloat(form.saw), cf: parseFloat(form.cf) };
    if (editing) {
      setData(prev => prev.map(h => h.id === editing.id ? { ...h, ...entry } : h));
      toast("Riwayat berhasil diperbarui!", "success");
    } else {
      setData(prev => [{ id: Date.now(), ...entry }, ...prev]);
      toast("Riwayat berhasil ditambahkan!", "success");
    }
    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(h => h.id !== delTarget.id));
    toast("Riwayat tes dihapus", "danger");
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));

  return (
    <div>
      <StatsGrid cols={4}>
        <StatCard label="Total Tes"      value={data.length}        badge="↑ 12 minggu ini"  badgeType="up" />
        <StatCard label="Rata-rata Skor CF" value={avgSAW.toFixed(2)} badge="keyakinan tinggi" badgeType="neutral" />
        <StatCard label="Tipe Dominan"   value={dominant}           badge="38%"              badgeType="up" />
        <StatCard label="Tes Hari Ini"   value={7}                  badge="aktif"            badgeType="neutral" />
      </StatsGrid>

      <TableCard>
        <TableHeader title="Riwayat Tes">
          <SearchInput placeholder="🔍  Cari pengguna atau karir..." value={search} onChange={v => { setSearch(v); setPage(1); }} />
        </TableHeader>

        <Table head={["Pengguna", "Tipe Holland", "Skor SAW", "Skor CF", "Rekomendasi Karir", "Tanggal", "Aksi"]}>
          {paginated.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)", fontSize: 13 }}>Tidak ada data tes</td></tr>
          ) : paginated.map(h => (
            <Tr key={h.id}>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={h.user} />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{h.user}</span>
                </div>
              </Td>
              <Td>{h.type.split("").map(c => <RiasecBadge key={c} letter={c} />)}</Td>
              <Td mono bold>{h.saw.toFixed(2)}</Td>
              <Td mono bold>{h.cf.toFixed(2)}</Td>
              <Td style={{ fontSize: 12, fontWeight: 600, color: "var(--app-accent)" }}>{h.career}</Td>
              <Td muted style={{ fontSize: 12 }}>{h.date}</Td>
              <Td>
                <div style={{ display: "flex", gap: 5 }}>
                  <Button size="sm" onClick={() => openDetail(h)}>Lihat</Button>
                  <Button size="sm" onClick={() => openEdit(h)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => openDelete(h)}>Hapus</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>

        <Pagination current={page} total={totalPages} onChange={setPage} info={`Menampilkan ${paginated.length} dari ${filtered.length} tes`} />
      </TableCard>

      {/* ── Form Modal ── */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Riwayat" : "Tambah Riwayat"}
        footer={<>
          <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>Simpan</Button>
        </>}
      >
        <FormGroup label="Nama Pengguna">
          <Input placeholder="Andi Prasetyo" value={form.user} onChange={e => set("user")(e.target.value)} />
        </FormGroup>
        <FormGrid>
          <FormGroup label="Tipe Holland (mis. SAI)">
            <Input placeholder="SAI" value={form.type} onChange={e => set("type")(e.target.value.toUpperCase().slice(0,3))} />
          </FormGroup>
          <FormGroup label="Tanggal Tes">
            <Input type="date" value={form.date} onChange={e => set("date")(e.target.value)} />
          </FormGroup>
        </FormGrid>
        <FormGroup label="Rekomendasi Karir">
          <Input placeholder="Software Engineer" value={form.career} onChange={e => set("career")(e.target.value)} />
        </FormGroup>
        <FormGrid>
          <FormGroup label="Skor SAW (0–1)">
            <Input type="number" min="0" max="1" step="0.01" placeholder="0.85" value={form.saw} onChange={e => set("saw")(e.target.value)} />
          </FormGroup>
          <FormGroup label="Skor CF (0–1)">
            <Input type="number" min="0" max="1" step="0.01" placeholder="0.80" value={form.cf} onChange={e => set("cf")(e.target.value)} />
          </FormGroup>
        </FormGrid>
      </Modal>

      {/* ── Detail Modal ── */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Hasil Tes"
        footer={<>
          <Button variant="ghost" onClick={() => setDetailOpen(false)}>Tutup</Button>
          <Button variant="primary" onClick={() => { setDetailOpen(false); openEdit(viewing); }}>Edit</Button>
        </>}
      >
        {viewing && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "PENGGUNA",           value: viewing.user },
              { label: "TIPE HOLLAND",        value: viewing.type },
              { label: "SKOR SAW",            value: viewing.saw.toFixed(4) },
              { label: "SKOR CF",             value: viewing.cf.toFixed(4) },
              { label: "REKOMENDASI KARIR",   value: viewing.career },
              { label: "TANGGAL TES",         value: viewing.date },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#F7F7F7", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title={`Hapus riwayat tes <strong>${delTarget?.user}</strong>?`}
        desc="Riwayat tes ini tidak dapat dipulihkan setelah dihapus."
      />
    </div>
  );
}
