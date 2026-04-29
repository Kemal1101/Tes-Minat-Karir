import { useState } from "react";
import { OCCUPATIONS as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGroup, FormGrid, Input, MonoTag, Select, Textarea,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const RIASEC_STYLE = {
  R: { bg: "#FCEBEB", color: "#A32D2D" },
  I: { bg: "#E6F1FB", color: "#185FA5" },
  A: { bg: "#FBEAF0", color: "#993556" },
  S: { bg: "#EAF3DE", color: "#3B6D11" },
  E: { bg: "#FAEEDA", color: "#854F0B" },
  C: { bg: "#EEEDFE", color: "#534AB7" },
};

const SECTORS = [
  "Teknologi Informasi",
  "Kesehatan",
  "Pendidikan",
  "Keuangan",
  "Seni & Desain",
  "Teknik",
  "Manajemen SDM",
  "Hukum",
  "Pertanian",
  "Pariwisata",
];

const PAGE_SIZE = 8;
const emptyForm = { name: "", onet: "", holland: "I", sector: "Teknologi Informasi", saw: "0.80", desc: "" };

export default function Occupations() {
  const toast = useToast();
  const [data,       setData]       = useState(INITIAL);
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page,       setPage]       = useState(1);

  const [formOpen,   setFormOpen]   = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [viewing,    setViewing]    = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  // Derived
  const filtered = data.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.onet.includes(search) || o.sector.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter ? o.holland === typeFilter : true;
    return matchSearch && matchType;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRec = "12.4k";
  const sectors  = [...new Set(data.map(o => o.sector))].length;

  function openCreate()  { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(o)   { setEditing(o);    setForm({ name: o.name, onet: o.onet, holland: o.holland, sector: o.sector, saw: o.saw.toString(), desc: o.desc || "" }); setFormOpen(true); }
  function openDetail(o) { setViewing(o);    setDetailOpen(true); }
  function openDelete(o) { setDelTarget(o);  setDeleteOpen(true); }

  function handleSave() {
    if (!form.name || !form.onet) { toast("Nama dan kode O*NET wajib diisi", "danger"); return; }
    const entry = { ...form, saw: parseFloat(form.saw) };
    if (editing) {
      setData(prev => prev.map(o => o.id === editing.id ? { ...o, ...entry } : o));
      toast("Pekerjaan berhasil diperbarui!", "success");
    } else {
      setData(prev => [...prev, { id: Date.now(), ...entry }]);
      toast("Pekerjaan berhasil ditambahkan!", "success");
    }
    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(o => o.id !== delTarget.id));
    toast("Pekerjaan dihapus", "danger");
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));

  return (
    <div>
      <StatsGrid cols={3}>
        <StatCard label="Total Pekerjaan"   value={data.length}  badge="O*NET basis"   badgeType="neutral" />
        <StatCard label="Sektor Industri"   value={sectors}      badge="beragam"       badgeType="up" />
        <StatCard label="Total Direkomendasikan" value={totalRec} badge="total kali"   badgeType="up" />
      </StatsGrid>

      <TableCard>
        <TableHeader title="Daftar Pekerjaan">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              style={{ padding: "7px 10px", borderRadius: 10, border: "1px solid var(--border)", background: "rgba(0,0,0,0.04)", fontSize: 12, fontFamily: "var(--font)", outline: "none", color: "var(--text-primary)" }}
            >
              <option value="">Semua Tipe</option>
              {Object.keys(RIASEC_STYLE).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <SearchInput placeholder="🔍  Cari pekerjaan..." value={search} onChange={v => { setSearch(v); setPage(1); }} />
          </div>
        </TableHeader>

        <Table head={["Nama Pekerjaan", "Kode O*NET", "Tipe Holland", "Sektor", "Bobot SAW", "Aksi"]}>
          {paginated.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)", fontSize: 13 }}>Tidak ada pekerjaan ditemukan</td></tr>
          ) : paginated.map(o => {
            const rs = RIASEC_STYLE[o.holland] || {};
            return (
              <Tr key={o.id}>
                <Td bold>{o.name}</Td>
                <Td><MonoTag>{o.onet}</MonoTag></Td>
                <Td>
                  <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.color }}>{o.holland}</span>
                </Td>
                <Td muted style={{ fontSize: 12 }}>{o.sector}</Td>
                <Td mono bold>{o.saw.toFixed(2)}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Button size="sm" onClick={() => openDetail(o)}>Detail</Button>
                    <Button size="sm" onClick={() => openEdit(o)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => openDelete(o)}>Hapus</Button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>

        <Pagination current={page} total={totalPages} onChange={setPage} info={`Menampilkan ${paginated.length} dari ${filtered.length} pekerjaan`} />
      </TableCard>

      {/* ── Form Modal ── */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Pekerjaan" : "Tambah Pekerjaan"}
        footer={<>
          <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>Simpan Pekerjaan</Button>
        </>}
      >
        <FormGroup label="Nama Pekerjaan">
          <Input placeholder="Software Engineer" value={form.name} onChange={e => set("name")(e.target.value)} />
        </FormGroup>
        <FormGrid>
          <FormGroup label="Kode O*NET">
            <Input placeholder="15-1252.00" value={form.onet} onChange={e => set("onet")(e.target.value)} style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
          </FormGroup>
          <FormGroup label="Sektor Industri">
            <Select value={form.sector} onChange={set("sector")}>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormGroup>
        </FormGrid>
        <FormGrid>
          <FormGroup label="Tipe Holland Primer">
            <Select value={form.holland} onChange={set("holland")}>
              {Object.keys(RIASEC_STYLE).map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="Bobot SAW (0–1)">
            <Input type="number" min="0" max="1" step="0.01" placeholder="0.85" value={form.saw} onChange={e => set("saw")(e.target.value)} />
          </FormGroup>
        </FormGrid>
        <FormGroup label="Deskripsi Pekerjaan">
          <Textarea placeholder="Deskripsi singkat tentang pekerjaan ini..." value={form.desc} onChange={e => set("desc")(e.target.value)} rows={3} />
        </FormGroup>
      </Modal>

      {/* ── Detail Modal ── */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Pekerjaan"
        footer={<>
          <Button variant="ghost" onClick={() => setDetailOpen(false)}>Tutup</Button>
          <Button variant="primary" onClick={() => { setDetailOpen(false); openEdit(viewing); }}>Edit</Button>
        </>}
      >
        {viewing && (() => {
          const rs = RIASEC_STYLE[viewing.holland] || {};
          return (
            <div>
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{viewing.name}</div>
                <MonoTag>{viewing.onet}</MonoTag>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[
                  { label: "TIPE HOLLAND", value: <span style={{ background: rs.bg, color: rs.color, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{viewing.holland}</span> },
                  { label: "SEKTOR",       value: viewing.sector },
                  { label: "BOBOT SAW",    value: viewing.saw.toFixed(4) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#F7F7F7", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
              {viewing.desc && (
                <div style={{ background: "#F7F7F7", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>DESKRIPSI</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-primary)" }}>{viewing.desc}</div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title={`Hapus pekerjaan <strong>${delTarget?.name}</strong>?`}
        desc="Pekerjaan ini tidak akan muncul di rekomendasi setelah dihapus."
      />
    </div>
  );
}
