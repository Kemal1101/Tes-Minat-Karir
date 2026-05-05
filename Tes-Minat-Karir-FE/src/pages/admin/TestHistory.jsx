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
  <div className="p-6">

    {/* STATS */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TOTAL TES</div>
        <div className="text-2xl font-bold">{data.length}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">RATA-RATA CF</div>
        <div className="text-2xl font-bold">{avgSAW.toFixed(2)}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TIPE DOMINAN</div>
        <div className="text-2xl font-bold">{dominant}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TES HARI INI</div>
        <div className="text-2xl font-bold">7</div>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="font-bold">Riwayat Tes</div>

        <input
          className="bg-gray-100 border px-3 py-2 rounded text-xs w-[220px]"
          placeholder="🔍 Cari pengguna atau karir..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400 uppercase">
          <tr>
            <th className="p-3 text-left">Pengguna</th>
            <th className="p-3 text-left">Tipe</th>
            <th className="p-3 text-left">SAW</th>
            <th className="p-3 text-left">CF</th>
            <th className="p-3 text-left">Karir</th>
            <th className="p-3 text-left">Tanggal</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                Tidak ada data tes
              </td>
            </tr>
          ) : (
            paginated.map((h) => (
              <tr key={h.id} className="border-t hover:bg-gray-50">

                {/* USER */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FAEEDA] text-[#854F0B] rounded-full flex items-center justify-center text-xs font-bold">
                      {h.user[0]}
                    </div>
                    <div className="font-semibold text-sm">{h.user}</div>
                  </div>
                </td>

                {/* RIASEC */}
                <td className="p-3">
                  {h.type.split("").map((c) => (
                    <span
                      key={c}
                      className="px-2 py-1 text-xs rounded-full mr-1"
                      style={{
                        background: RIASEC_STYLE[c]?.bg,
                        color: RIASEC_STYLE[c]?.color,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </td>

                {/* SAW */}
                <td className="p-3 font-semibold">
                  {h.saw.toFixed(2)}
                </td>

                {/* CF */}
                <td className="p-3 font-semibold">
                  {h.cf.toFixed(2)}
                </td>

                {/* KARIR */}
                <td className="p-3 text-[#854F0B] font-semibold">
                  {h.career}
                </td>

                {/* TANGGAL */}
                <td className="p-3 text-gray-500 text-sm">
                  {h.date}
                </td>

                {/* AKSI */}
                <td className="p-3">
                  <div className="flex gap-2">
                    
                    <button
                      onClick={() => openEdit(h)}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(h)}
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
          Menampilkan {paginated.length} dari {filtered.length} data
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>

    {/* MODAL (TIDAK DIUBAH) */}
    {formOpen && (
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Form">
        {/* tetap pakai form lama */}
      </Modal>
    )}
  </div>
);
}
