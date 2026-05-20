import { useState, useEffect } from "react";
import { QUESTIONS as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import { RefreshCw, Plus } from "lucide-react";
import { api } from "../../lib/api";
import {
  Button, FormGroup, FormGrid, Input, Select, Textarea,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const icons = {
  refresh: RefreshCw,
  add: Plus,
};

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
const emptyForm = { text: "", type: "R", cf: "0.5", keywords: "" };

export default function Questions() {
  const toast  = useToast();
  const { setActions } = useAdminPage();
  const [data,       setData]       = useState([]);
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page,       setPage]       = useState(1);

  const [formOpen,   setFormOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(emptyForm);


    // 🔗 Dynamic Topbar
  const topbar = {
    title: "Daftar Pertanyaan",

    subtitle: "Kelola semua pertanyaan untuk tes",

    actions: [],
  };

  useEffect(() => {
    setActions(topbar);

    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const result = await api.getQuestions();
      const mapped = result.map(q => ({
        id: q.id,
        text: q.text,
        type: q.category,
        cf: q.cf_pakar,
        keywords: q.keywords || ""
      }));
      setData(mapped);
    } catch (err) {
      toast("Gagal memuat soal", "danger");
      console.error(err);
    }
  };

  // 🔍 Filter
  const filtered = data.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter ? q.type === typeFilter : true;
    return matchSearch && matchType;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(q)  { setEditing(q); setForm({ text: q.text, type: q.type, cf: q.cf.toString(), keywords: q.keywords || "" }); setFormOpen(true); }
  function openDelete(q){ setDelTarget(q); setDeleteOpen(true); }

  async function handleSave() {
    if (!form.text.trim()) { toast("Teks pertanyaan wajib diisi", "danger"); return; }
    try {
      const payload = {
        text: form.text,
        category: form.type,
        cf_pakar: parseFloat(form.cf),
        keywords: form.keywords || ""
      };
      if (editing) {
        await api.updateQuestion(editing.id, payload);
        toast("Pertanyaan berhasil diperbarui!", "success");
      } else {
        await api.createQuestion(payload);
        toast("Pertanyaan berhasil ditambahkan!", "success");
      }
      loadQuestions();
      setFormOpen(false);
    } catch (err) {
      toast("Gagal menyimpan pertanyaan", "danger");
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteQuestion(delTarget.id);
      toast("Pertanyaan dihapus", "danger");
      loadQuestions();
      setDeleteOpen(false);
    } catch (err) {
      toast("Gagal menghapus pertanyaan", "danger");
      console.error(err);
    }
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));
  const { title, subtitle, actions } = topbar;

 return (
   <>
    {/* Top Bar */}
    <div className="bg-white border-b border-zinc-200 px-4 py-2 flex items-start justify-between sticky top-0 z-50">

      {/* LEFT */}
      <div className="leading-tight">
        <h1 className="m-0 text-[20px] font-bold text-zinc-900 leading-none">
          {title}
        </h1>

        <p className="m-0 mt-1 text-xs text-zinc-500 leading-none">
          {subtitle}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {actions.map((action, index) => {
          const Icon = icons[action.icon];

          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                inline-flex items-center gap-2
                h-10 px-5 rounded-xl
                text-sm font-medium
                transition-all

                ${
                  action.variant === "primary"
                    ? "bg-amber-700 hover:bg-amber-800 text-white"
                    : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700"
                }
              `}
            >
              {Icon && <Icon size={16} />}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>

  <div className="p-6 bg-[#f8f6f2] min-h-screen">

    {/* STATS */}
    <div className="grid grid-cols-3 gap-4 mb-6">

      {[
        {
          label: "TOTAL SOAL",
          value: data.length,
          badge: "6 tipe RIASEC",
          color: "blue"
        },
        {
          label: "PER TIPE",
          value: Math.round(data.length / 6) || 0,
          badge: "seimbang",
          color: "green"
        }
      ].map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-xs text-gray-400 mb-1">{card.label}</div>
          <div className="text-3xl font-bold">{card.value}</div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            card.color === "green"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-600"
          }`}>
            {card.badge}
          </span>
        </div>
      ))}

    </div>
    {/* TABLE */}
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b">
        <div className="font-semibold">Bank Soal</div>

        <div className="flex gap-3 items-center">

          {/* BUTTON */}
          <button onClick={openCreate} className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white transition-all">
            <Plus size={16} />
            Tambah
          </button>

          {/* FILTER */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-100 border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">Semua Tipe</option>
            {Object.entries(RIASEC_STYLE).map(([t, s]) => (
              <option key={t} value={t}>
                {t} — {s.label}
              </option>
            ))}
          </select>

          {/* SEARCH */}
          <input
            className="bg-gray-100 border px-4 py-2 rounded-full text-sm w-[220px]"
            placeholder="🔍 Cari soal..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400 uppercase">
          <tr>
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Pertanyaan</th>
            <th className="p-4 text-left">Tipe</th>
            <th className="p-4 text-left">CF Pakar</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((q, i) => {
            const s = RIASEC_STYLE[q.type] || {};
            return (
              <tr key={q.id} className="border-t hover:bg-gray-50">

                <td className="p-4 text-gray-400 font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </td>

                <td className="p-4 max-w-[400px]">{q.text}</td>

                <td className="p-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {q.type}
                  </span>
                </td>

                <td className="p-4">
                  {(q.cf || 0).toFixed(1)}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">

                    <button onClick={() => openEdit(q)} className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100">
                      Edit </button>
                    <button onClick={() => openDelete(q)} className="text-xs px-3 py-1 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-full">
                      Hapus</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="flex justify-between items-center p-4">
        <div className="text-xs text-gray-400">
          Menampilkan {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} soal
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>

    {/* MODAL FORM */}
    <Modal
      open={formOpen}
      onClose={() => setFormOpen(false)}
      title={editing ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
    >
      <div className="space-y-3">

        <textarea
          className="w-full border p-3 rounded-lg text-sm"
          placeholder="Tulis pertanyaan..."
          value={form.text}
          onChange={(e) => set("text")(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg text-sm"
          placeholder="Keywords (pisahkan dengan koma)..."
          value={form.keywords}
          onChange={(e) => set("keywords")(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded-lg text-sm"
          value={form.type}
          onChange={(e) => set("type")(e.target.value)}
        >
          {Object.entries(RIASEC_STYLE).map(([t, s]) => (
            <option key={t} value={t}>{t} — {s.label}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="0.01"
            className="border p-2 rounded-lg text-sm"
            value={form.cf}
            onChange={(e) => set("cf")(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-2 rounded-lg text-sm"
        >
          Simpan
        </button>

      </div>
    </Modal>

    {/* DELETE MODAL */}
    <ConfirmModal
      open={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      onConfirm={handleDelete}
      title="Hapus pertanyaan?"
      desc="Data tidak bisa dikembalikan."
    />

  </div>
  </>
);
}

