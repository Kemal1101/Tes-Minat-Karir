import { useState, useEffect } from "react";
import { TEST_HISTORY as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import { useAdminPage } from "../../hooks/useAdminPage";
import { RefreshCw, Plus } from "lucide-react";
import {
  Avatar, Badge, Button, FormGroup, FormGrid, Input, Select,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";


const icons = {
  refresh: RefreshCw,
  add: Plus,
};

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
  const { setActions } = useAdminPage();
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


    // 🔗 Dynamic Topbar
  const topbar = {
    title: "Test History",

    subtitle: "Riwayat hasil tes minat karir pengguna",

    actions: [
      {
        label: "Refresh",
        icon: "refresh",
        variant: "secondary",

        onClick: () => {
          toast("Data diperbarui", "info");
        },
      },
    ],
  };

  useEffect(() => {
    setActions(topbar);

    return () => {
      setActions(null);
    };
  }, []);

  // 🔍 Filter
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
    setDeleteOpen(false);
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
    <div className="grid grid-cols-4 gap-4 mb-6">

      {[
        {
          label: "TOTAL TES",
          value: data.length,
          badge: "↑ 12 minggu ini",
          color: "green"
        },
        {
          label: "RATA-RATA SKOR",
          value: avgSAW.toFixed(2),
          badge: "keyakinan tinggi",
          color: "blue"
        },
        {
          label: "TIPE DOMINAN",
          value: dominant,
          badge: "paling sering",
          color: "green"
        },
        {
          label: "TES HARI INI",
          value: 7,
          badge: "aktif",
          color: "blue"
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
        <div className="font-semibold">Riwayat Tes</div>

        <input
          className="bg-gray-100 border px-4 py-2 rounded-full text-sm w-[260px]"
          placeholder="🔍 Cari pengguna..."
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
            <th className="p-4 text-left">Pengguna</th>
            <th className="p-4 text-left">Tipe Holland</th>
            <th className="p-4 text-left">SAW</th>
            <th className="p-4 text-left">CF</th>
            <th className="p-4 text-left">Karir</th>
            <th className="p-4 text-left">Tanggal</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((h) => (
            <tr key={h.id} className="border-t hover:bg-gray-50">

              {/* USER */}
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAEEDA] text-[#854F0B] flex items-center justify-center text-xs font-bold">
                    {h.user.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="font-semibold">{h.user}</div>
                </div>
              </td>

              {/* RIASEC */}
              <td className="p-4">
                <div className="flex gap-1">
                  {h.type.split("").map((c) => {
                    const s = RIASEC_STYLE[c] || {};
                    return (
                      <span
                        key={c}
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </div>
              </td>

              <td className="p-4 font-semibold">{h.saw.toFixed(2)}</td>
              <td className="p-4 font-semibold">{h.cf.toFixed(2)}</td>

              <td className="p-4 text-[#854F0B] font-semibold">
                {h.career}
              </td>

              <td className="p-4 text-gray-500">{h.date}</td>

              {/* AKSI */}
              <td className="p-4">
                <div className="flex gap-2">
                  <button onClick={() => { setViewing(h);setDetailOpen(true); }} className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100">
                    Lihat </button>
                  <button onClick={() => openDelete(h)} className="text-xs px-3 py-1 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-full">
                    Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="flex justify-between items-center p-4">

        <div className="text-xs text-gray-400">
          Menampilkan {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} tes
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>

    {/* DETAIL MODAL */}
    <Modal
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      title="Detail Hasil Tes"
    >
      {viewing && (
        <div className="space-y-3 text-sm">
          <div><b>Pengguna:</b> {viewing.user}</div>
          <div><b>Tipe:</b> {viewing.type}</div>
          <div><b>SAW:</b> {viewing.saw}</div>
          <div><b>CF:</b> {viewing.cf}</div>
          <div><b>Karir:</b> {viewing.career}</div>
          <div><b>Tanggal:</b> {viewing.date}</div>
        </div>
      )}
    </Modal>

    {/* DELETE MODAL */}
    <ConfirmModal
      open={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      onConfirm={handleDelete}
      title="Hapus riwayat ini?"
      desc="Data tidak bisa dikembalikan setelah dihapus."
    />

  </div>
  </>
);
}
