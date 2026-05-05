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
  <div className="p-6">

    {/* STATS */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TOTAL SOAL</div>
        <div className="text-2xl font-bold">{data.length}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">RATA-RATA PER TIPE</div>
        <div className="text-2xl font-bold">
          {Math.round(data.length / 6)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">BOBOT SAW</div>
        <div className="text-2xl font-bold">0.167</div>
      </div>
    </div>

    {/* BADGE RIASEC */}
    <div className="flex gap-2 flex-wrap mb-6">
      {Object.entries(RIASEC_STYLE).map(([type, s]) => (
        <div
          key={type}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: s.bg, color: s.color }}
        >
          <span>{type}</span>
          <span>{s.label}</span>
          <span className="font-bold">{typeCounts[type]}</span>
        </div>
      ))}
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="font-bold">Bank Soal</div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-100 border px-3 py-2 rounded text-xs"
          >
            <option value="">Semua Tipe</option>
            {Object.entries(RIASEC_STYLE).map(([t, s]) => (
              <option key={t} value={t}>
                {t} — {s.label}
              </option>
            ))}
          </select>

          <input
            className="bg-gray-100 border px-3 py-2 rounded text-xs w-[200px]"
            placeholder="🔍 Cari soal..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400 uppercase">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Pertanyaan</th>
            <th className="p-3 text-left">Tipe</th>
            <th className="p-3 text-left">SAW</th>
            <th className="p-3 text-left">CF</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                Tidak ada soal ditemukan
              </td>
            </tr>
          ) : (
            paginated.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">

                {/* ID */}
                <td className="p-3 text-gray-400 text-xs">
                  {String(q.id).padStart(2, "0")}
                </td>

                {/* TEXT */}
                <td className="p-3 max-w-[300px] text-sm leading-relaxed">
                  {q.text}
                </td>

                {/* RIASEC */}
                <td className="p-3">
                  <span
                    className="px-2 py-1 text-xs rounded-full font-semibold"
                    style={{
                      background: RIASEC_STYLE[q.type]?.bg,
                      color: RIASEC_STYLE[q.type]?.color,
                    }}
                  >
                    {q.type}
                  </span>
                </td>

                {/* SAW */}
                <td className="p-3 font-semibold">
                  {q.saw.toFixed(3)}
                </td>

                {/* CF */}
                <td className="p-3 font-semibold">
                  {q.cf.toFixed(1)}
                </td>

                {/* AKSI */}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(q)}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(q)}
                      className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="p-4 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Menampilkan {paginated.length} dari {filtered.length} soal
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>

    {/* MODAL (tetap pakai logic lama) */}
    {formOpen && (
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Form">
        {/* tetap */}
      </Modal>
    )}
  </div>
  );
}
