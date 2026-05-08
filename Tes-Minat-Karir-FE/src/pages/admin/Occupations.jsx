import { useState, useEffect } from "react";
import { OCCUPATIONS as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";
import { RefreshCw, Plus } from "lucide-react";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGroup, FormGrid, Input, Select, Textarea,
} from "../../components/ui/UI";

const icons = {
  refresh: RefreshCw,
  add: Plus,
};

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

const emptyForm = {
  name: "",
  onet: "",
  holland: "I",
  sector: "Teknologi Informasi",
  saw: "0.80",
  desc: "",
};

export default function Occupations() {
  const toast = useToast();
  const { setActions } = useAdminPage();

  const [data, setData] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // 🔗 Dynamic Topbar
  const topbar = {
    title: "Daftar Pekerjaan",

    subtitle: "kelola daftar pekerjaan",

    actions: [
      {
        label: "Refresh",
        icon: "refresh",
        variant: "secondary",

        onClick: () => {
          toast("Data diperbarui", "info");
        },
      },

      {
        label: "Tambah Pekerjaan",
        icon: "add",
        variant: "primary",

        onClick: openCreate,
      },
    ],
  };

  useEffect(() => {
    setActions(topbar.actions);

    return () => {
      setActions(null);
    };
  }, []);

  // 🔍 Filter
  const filtered = data.filter(o =>
    `${o.name} ${o.onet} ${o.sector}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRec = "12.4k";
  const sectors = [...new Set(data.map(o => o.sector))].length;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(o) {
    setEditing(o);
    setForm({
      name: o.name,
      onet: o.onet,
      holland: o.holland,
      sector: o.sector,
      saw: o.saw.toString(),
      desc: o.desc || "",
    });
    setFormOpen(true);
  }

  function openDelete(o) {
    setDelTarget(o);
    setDeleteOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.onet) {
      toast("Nama & O*NET wajib diisi", "danger");
      return;
    }

    const entry = { ...form, saw: parseFloat(form.saw) };

    if (editing) {
      setData(prev =>
        prev.map(o => (o.id === editing.id ? { ...o, ...entry } : o))
      );
      toast("Berhasil update pekerjaan", "success");
    } else {
      setData(prev => [{ id: Date.now(), ...entry }, ...prev]);
      toast("Berhasil tambah pekerjaan", "success");
    }

    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(o => o.id !== delTarget.id));
    toast("Pekerjaan dihapus", "danger");
  }

  const set = key => val => setForm(f => ({ ...f, [key]: val }));
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
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="text-xs text-gray-400 mb-1">TOTAL PEKERJAAN</div>
          <div className="text-4xl font-bold">{data.length}</div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            O*NET
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="text-xs text-gray-400 mb-1">SEKTOR</div>
          <div className="text-4xl font-bold">{sectors}</div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            aktif
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="text-xs text-gray-400 mb-1">DIREKOMENDASIKAN</div>
          <div className="text-4xl font-bold">{totalRec}</div>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
            total
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 flex justify-between items-center">
          <div className="text-lg font-bold">Daftar Pekerjaan</div>

          <input
            className="bg-gray-100 px-4 py-2 rounded-xl text-sm w-[260px]"
            placeholder="🔍 Cari..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 uppercase">
            <tr>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">O*NET</th>
              <th className="p-4 text-left">Tipe</th>
              <th className="p-4 text-left">Sektor</th>
              <th className="p-4 text-left">SAW</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{o.name}</td>

                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {o.onet}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: RIASEC_STYLE[o.holland]?.bg,
                      color: RIASEC_STYLE[o.holland]?.color,
                    }}
                  >
                    {o.holland}
                  </span>
                </td>

                <td className="p-4 text-gray-500">{o.sector}</td>

                <td className="p-4 font-bold">{o.saw.toFixed(2)}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(o)} className="px-3 py-1 border rounded-lg text-xs" >
                      Edit </button>
                    <button onClick={() => openDelete(u)} className="text-xs px-3 py-1 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-full">
                      Hapus </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
            {filtered.length}
          </div>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-xs rounded ${
                  page === i + 1
                    ? "bg-orange-700 text-white"
                    : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit" : "Tambah"}
      >
        <FormGroup label="Nama">
          <Input value={form.name} onChange={e => set("name")(e.target.value)} />
        </FormGroup>

        <FormGroup label="O*NET">
          <Input value={form.onet} onChange={e => set("onet")(e.target.value)} />
        </FormGroup>

        <FormGroup label="Tipe">
          <Select value={form.holland} onChange={set("holland")}>
            {Object.keys(RIASEC_STYLE).map(t => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="Sektor">
          <Select value={form.sector} onChange={set("sector")}>
            {SECTORS.map(s => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="SAW">
          <Input
            type="number"
            value={form.saw}
            onChange={e => set("saw")(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Deskripsi">
          <Textarea
            value={form.desc}
            onChange={e => set("desc")(e.target.value)}
          />
        </FormGroup>

        <Button onClick={handleSave}>Simpan</Button>
      </Modal>

      {/* DELETE */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus data?"
        desc="Data akan hilang permanen"
      />
    </div>
    </>
  );
}