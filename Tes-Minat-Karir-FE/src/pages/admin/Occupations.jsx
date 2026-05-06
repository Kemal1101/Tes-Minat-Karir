import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";
import { api } from "../../lib/api";

import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGroup, FormGrid, Input, Select, Textarea, Pagination
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

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadOccupations();
    setActions({
      onAdd: openCreate,
      onRefresh: () => {
        loadOccupations();
        toast("Data pekerjaan diperbarui", "info");
      },
    });
  }, []);

  const loadOccupations = async () => {
    try {
      const result = await api.getOccupations();
      const mapped = result.map(o => ({
        id: o.id,
        name: o.occupation || "",
        onet: o.code || "",
        holland: o.interest_code || "I",
        sector: o.job_zone || "Teknologi Informasi",
        saw: 0.80,
        desc: ""
      }));
      setData(mapped);
    } catch (err) {
      toast("Gagal memuat pekerjaan", "danger");
      console.error(err);
    }
  };

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

  async function handleSave() {
    if (!form.name || !form.onet) {
      toast("Nama & O*NET wajib diisi", "danger");
      return;
    }

    try {
      const payload = {
        occupation: form.name,
        code: form.onet,
        interest_code: form.holland,
        job_zone: form.sector
      };

      if (editing) {
        await api.updateOccupation(editing.id, payload);
        toast("Berhasil update pekerjaan", "success");
      } else {
        await api.createOccupation(payload);
        toast("Berhasil tambah pekerjaan", "success");
      }
      
      loadOccupations();
      setFormOpen(false);
    } catch (err) {
      toast("Gagal menyimpan pekerjaan", "danger");
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteOccupation(delTarget.id);
      toast("Pekerjaan dihapus", "danger");
      loadOccupations();
      setDeleteOpen(false);
    } catch (err) {
      toast("Gagal menghapus pekerjaan", "danger");
      console.error(err);
    }
  }

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

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

        <div className="overflow-x-auto">
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
                <td className="p-4 font-semibold max-w-xs truncate" title={o.name}>{o.name}</td>

                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs whitespace-nowrap">
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

                <td className="p-4 text-gray-500 max-w-[150px] truncate" title={o.sector}>{o.sector}</td>

                <td className="p-4 font-bold">{(o.saw || 0).toFixed(2)}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(o)}
                      className="px-3 py-1 border rounded-lg text-xs hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(o)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Menampilkan {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
            {filtered.length}
          </div>

          <Pagination current={page} total={totalPages} onChange={setPage} />
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
            disabled
            title="SAW constant in backend"
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
  );
}