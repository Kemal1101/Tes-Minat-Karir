import { useState } from "react";
import { QUESTIONS as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGroup, FormGrid, Input, Select, Textarea,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const RIASEC_STYLE = {
  R: { bg: "#FCEBEB", color: "#A32D2D", label: "Realistic" },
  I: { bg: "#E6F1FB", color: "#185FA5", label: "Investigative" },
  A: { bg: "#FBEAF0", color: "#993556", label: "Artistic" },
  S: { bg: "#EAF3DE", color: "#3B6D11", label: "Social" },
  E: { bg: "#FAEEDA", color: "#854F0B", label: "Enterprising" },
  C: { bg: "#EEEDFE", color: "#534AB7", label: "Conventional" },
};

function RiasecBadge({ type, showLabel = false }) {
  const s = RIASEC_STYLE[type] || {};
  return (
    <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      {type}{showLabel && s.label ? ` — ${s.label}` : ""}
    </span>
  );
}

const PAGE_SIZE = 8;
const emptyForm = { text: "", type: "R", saw: "0.167", cf: "0.5" };

export default function Questions() {
  const toast  = useToast();
  const [data,       setData]       = useState(INITIAL);
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page,       setPage]       = useState(1);

  const [formOpen,   setFormOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  // Derived
  const filtered = data.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter ? q.type === typeFilter : true;
    return matchSearch && matchType;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats per type
  const typeCounts = Object.fromEntries(
    Object.keys(RIASEC_STYLE).map(t => [t, data.filter(q => q.type === t).length])
  );

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(q)  { setEditing(q); setForm({ text: q.text, type: q.type, saw: q.saw.toString(), cf: q.cf.toString() }); setFormOpen(true); }
  function openDelete(q){ setDelTarget(q); setDeleteOpen(true); }

  function handleSave() {
    if (!form.text.trim()) { toast("Teks pertanyaan wajib diisi", "danger"); return; }
    const entry = { ...form, saw: parseFloat(form.saw), cf: parseFloat(form.cf) };
    if (editing) {
      setData(prev => prev.map(q => q.id === editing.id ? { ...q, ...entry } : q));
      toast("Pertanyaan berhasil diperbarui!", "success");
    } else {
      setData(prev => [...prev, { id: Date.now(), ...entry }]);
      toast("Pertanyaan berhasil ditambahkan!", "success");
    }
    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(q => q.id !== delTarget.id));
    toast("Pertanyaan dihapus", "danger");
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));

  return (
    <div>
      {/* Stats */}
      <StatsGrid cols={3}>
        <StatCard label="Total Soal"      value={data.length}  badge="6 tipe RIASEC"  badgeType="neutral" />
        <StatCard label="Per Tipe (rata)" value={Math.round(data.length / 6)} badge="seimbang" badgeType="up" />
        <StatCard label="Bobot SAW rata" value="0.167"          badge="SAW"            badgeType="neutral" />
      </StatsGrid>

      {/* RIASEC distribution mini badges */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(RIASEC_STYLE).map(([type, s]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, background: s.bg, borderRadius: 10, padding: "6px 12px" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{type}</span>
            <span style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, marginLeft: 4 }}>{typeCounts[type]}</span>
          </div>
        ))}
      </div>

      <TableCard>
        <TableHeader title="Bank Soal">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              style={{ padding: "7px 10px", borderRadius: 10, border: "1px solid var(--border)", background: "rgba(0,0,0,0.04)", fontSize: 12, fontFamily: "var(--font)", outline: "none", color: "var(--text-primary)", cursor: "pointer" }}
            >
              <option value="">Semua Tipe</option>
              {Object.entries(RIASEC_STYLE).map(([t, s]) => (
                <option key={t} value={t}>{t} — {s.label}</option>
              ))}
            </select>
            <SearchInput placeholder="🔍  Cari soal..." value={search} onChange={v => { setSearch(v); setPage(1); }} />
          </div>
        </TableHeader>

        <Table head={["#", "Pertanyaan", "Tipe RIASEC", "Bobot SAW", "CF Prior", "Aksi"]}>
          {paginated.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)", fontSize: 13 }}>Tidak ada soal ditemukan</td></tr>
          ) : paginated.map((q, i) => (
            <Tr key={q.id}>
              <Td mono muted>{String(q.id).padStart(2, "0")}</Td>
              <Td style={{ maxWidth: 320, fontSize: 12, lineHeight: 1.5 }}>{q.text}</Td>
              <Td><RiasecBadge type={q.type} /></Td>
              <Td mono>{q.saw.toFixed(3)}</Td>
              <Td mono>{q.cf.toFixed(1)}</Td>
              <Td>
                <div style={{ display: "flex", gap: 5 }}>
                  <Button size="sm" onClick={() => openEdit(q)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => openDelete(q)}>Hapus</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>

        <Pagination current={page} total={totalPages} onChange={setPage} info={`Menampilkan ${paginated.length} dari ${filtered.length} soal`} />
      </TableCard>

      {/* ── Form Modal ── */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
        footer={<>
          <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>Simpan</Button>
        </>}
      >
        <FormGroup label="Teks Pertanyaan">
          <Textarea
            placeholder="Saya suka melakukan pekerjaan dengan tangan atau menggunakan alat mekanik..."
            value={form.text}
            onChange={e => set("text")(e.target.value)}
            rows={3}
          />
        </FormGroup>
        <FormGroup label="Tipe RIASEC">
          <Select value={form.type} onChange={set("type")}>
            {Object.entries(RIASEC_STYLE).map(([t, s]) => (
              <option key={t} value={t}>{t} — {s.label}</option>
            ))}
          </Select>
        </FormGroup>
        <FormGrid>
          <FormGroup label="Bobot SAW (0–1)">
            <Input type="number" min="0" max="1" step="0.001" placeholder="0.167" value={form.saw} onChange={e => set("saw")(e.target.value)} />
          </FormGroup>
          <FormGroup label="CF Prior (0–1)">
            <Input type="number" min="0" max="1" step="0.01" placeholder="0.5" value={form.cf} onChange={e => set("cf")(e.target.value)} />
          </FormGroup>
        </FormGrid>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Hapus pertanyaan ini?"
        desc="Pertanyaan tidak dapat dipulihkan setelah dihapus dari bank soal."
      />
    </div>
  );
}
