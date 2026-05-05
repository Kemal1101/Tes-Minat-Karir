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
  <div className="p-6">

    {/* STATS */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TOTAL PEKERJAAN</div>
        <div className="text-2xl font-bold">{data.length}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">SEKTOR INDUSTRI</div>
        <div className="text-2xl font-bold">{sectors}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TOTAL DIREKOMENDASIKAN</div>
        <div className="text-2xl font-bold">{totalRec}</div>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="font-bold">Daftar Pekerjaan</div>

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
            {Object.keys(RIASEC_STYLE).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            className="bg-gray-100 border px-3 py-2 rounded text-xs w-[200px]"
            placeholder="🔍 Cari pekerjaan..."
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
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">O*NET</th>
            <th className="p-3 text-left">Tipe</th>
            <th className="p-3 text-left">Sektor</th>
            <th className="p-3 text-left">SAW</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                Tidak ada pekerjaan ditemukan
              </td>
            </tr>
          ) : (
            paginated.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">

                {/* NAMA */}
                <td className="p-3 font-semibold">
                  {o.name}
                </td>

                {/* O*NET */}
                <td className="p-3 text-xs font-mono bg-gray-100 inline-block rounded px-2 py-1">
                  {o.onet}
                </td>

                {/* RIASEC */}
                <td className="p-3">
                  <span
                    className="px-2 py-1 text-xs rounded-full font-semibold"
                    style={{
                      background: RIASEC_STYLE[o.holland]?.bg,
                      color: RIASEC_STYLE[o.holland]?.color,
                    }}
                  >
                    {o.holland}
                  </span>
                </td>

                {/* SEKTOR */}
                <td className="p-3 text-gray-500 text-sm">
                  {o.sector}
                </td>

                {/* SAW */}
                <td className="p-3 font-semibold">
                  {o.saw.toFixed(2)}
                </td>

                {/* AKSI */}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetail(o)}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => openEdit(o)}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(o)}
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
          Menampilkan {paginated.length} dari {filtered.length} pekerjaan
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>

    {/* MODAL tetap */}
    {formOpen && (
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Form">
        {/* tetap */}
      </Modal>
    )}
  </div>
);
}
