import { useState } from "react";
import { TOKEN_BLACKLIST as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  AlertBanner, Button, FormGroup, Input, MonoTag, Select,
  Pagination, SearchInput, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const PAGE_SIZE = 8;
const emptyForm = { jti: "", user: "", reason: "", by: "Super Admin", blocked: "", expires: "" };

export default function TokenBlacklist() {
  const toast = useToast();
  const [data,     setData]     = useState(INITIAL);
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);

  const [formOpen,  setFormOpen]  = useState(false);
  const [deleteOpen,setDeleteOpen]= useState(false);
  const [editing,   setEditing]   = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [form,      setForm]      = useState(emptyForm);

  // Derived
  const filtered   = data.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.jti.toLowerCase().includes(search.toLowerCase()) ||
    t.reason.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Check if token is expired
  const isExpired = (dateStr) => {
    try { return new Date(dateStr) < new Date(); }
    catch { return false; }
  };

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }
  function openEdit(t)  { setEditing(t); setForm({ jti: t.jti, user: t.user, reason: t.reason, by: t.by, blocked: t.blocked, expires: t.expires }); setFormOpen(true); }
  function openDelete(t){ setDelTarget(t); setDeleteOpen(true); }

  function handleSave() {
    if (!form.jti || !form.user) { toast("Token JTI dan nama pengguna wajib diisi", "danger"); return; }
    if (editing) {
      setData(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast("Token blacklist diperbarui!", "success");
    } else {
      setData(prev => [{ id: Date.now(), ...form }, ...prev]);
      toast("Token berhasil di-blacklist!", "success");
    }
    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(t => t.id !== delTarget.id));
    toast("Token dihapus dari blacklist", "success");
  }

  const set = (k) => (val) => setForm(f => ({ ...f, [k]: val }));

  return (
  <div className="p-6">

    {/* ALERT */}
    {data.length > 0 && (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
        ⚠️ {data.length} token aktif di-blacklist — token ini tidak bisa digunakan lagi.
      </div>
    )}

    {/* STATS */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">TOTAL BLACKLIST</div>
        <div className="text-2xl font-bold">{data.length}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">BULAN INI</div>
        <div className="text-2xl font-bold">{data.length}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="text-xs text-gray-500 mb-1">AKAN EXPIRE</div>
        <div className="text-2xl font-bold">1</div>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="font-bold">Token Blacklist</div>

        <input
          className="bg-gray-100 border px-3 py-2 rounded text-xs w-[220px]"
          placeholder="🔍 Cari token / user..."
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
            <th className="p-3 text-left">Token</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Alasan</th>
            <th className="p-3 text-left">Oleh</th>
            <th className="p-3 text-left">Tanggal</th>
            <th className="p-3 text-left">Expire</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                Tidak ada token blacklist
              </td>
            </tr>
          ) : (
            paginated.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">

                {/* TOKEN */}
                <td className="p-3">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {t.jti}
                  </span>
                </td>

                {/* USER */}
                <td className="p-3 font-semibold">
                  {t.user}
                </td>

                {/* REASON */}
                <td className="p-3 text-gray-500 text-sm max-w-[180px]">
                  {t.reason}
                </td>

                {/* BY */}
                <td className="p-3 text-gray-400 text-sm">
                  {t.by}
                </td>

                {/* BLOCKED */}
                <td className="p-3 text-red-600 text-sm font-semibold">
                  {t.blocked}
                </td>

                {/* EXPIRE */}
                <td className="p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t.expires}</span>

                    {isExpired(t.expires) && (
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(t)}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openDelete(t)}
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
          Menampilkan {paginated.length} dari {filtered.length} token
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
