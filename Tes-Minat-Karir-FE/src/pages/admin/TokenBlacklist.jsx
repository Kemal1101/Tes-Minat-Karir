import { useState, useEffect } from "react";
import { TOKEN_BLACKLIST as INITIAL } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";

import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGroup, Input, Pagination
} from "../../components/ui/UI";

const PAGE_SIZE = 8;

const emptyForm = {
  jti: "",
  user: "",
  reason: "",
  by: "Super Admin",
  blocked: "",
  expires: ""
};

export default function TokenBlacklist() {
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

  useEffect(() => {
    setActions({
      onAdd: openCreate,
      onRefresh: () => toast("Data blacklist diperbarui", "info"),
    });
  }, []);

  const filtered = data.filter(t =>
    `${t.user} ${t.jti} ${t.reason}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isExpired = (dateStr) => {
    try { return new Date(dateStr) < new Date(); }
    catch { return false; }
  };

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(t) {
    setEditing(t);
    setForm({ ...t });
    setFormOpen(true);
  }

  function openDelete(t) {
    setDelTarget(t);
    setDeleteOpen(true);
  }

  function handleSave() {
    if (!form.jti || !form.user) {
      toast("JTI & User wajib diisi", "danger");
      return;
    }

    if (editing) {
      setData(prev =>
        prev.map(t => (t.id === editing.id ? { ...t, ...form } : t))
      );
      toast("Token diperbarui", "success");
    } else {
      setData(prev => [{ id: Date.now(), ...form }, ...prev]);
      toast("Token di-blacklist", "success");
    }

    setFormOpen(false);
  }

  function handleDelete() {
    setData(prev => prev.filter(t => t.id !== delTarget.id));
    toast("Token dihapus", "danger");
  }

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ALERT */}
      {data.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
          ⚠️ {data.length} token di-blacklist — tidak bisa digunakan.
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="text-xs text-gray-400 mb-1">TOTAL</div>
          <div className="text-3xl font-bold">{data.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="text-xs text-gray-400 mb-1">BULAN INI</div>
          <div className="text-3xl font-bold">{data.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="text-xs text-gray-400 mb-1">EXPIRED</div>
          <div className="text-3xl font-bold">
            {data.filter(t => isExpired(t.expires)).length}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">

        {/* HEADER */}
        <div className="p-5 flex justify-between items-center border-b">
          <div className="font-bold">Token Blacklist</div>

          <input
            className="bg-gray-100 px-4 py-2 rounded-xl text-sm w-[250px]"
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
              <th className="p-4 text-left">Token</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Alasan</th>
              <th className="p-4 text-left">Oleh</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Expire</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paginated.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">

                  <td className="p-4">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {t.jti}
                    </span>
                  </td>

                  <td className="p-4 font-semibold">{t.user}</td>

                  <td className="p-4 text-gray-500">{t.reason}</td>

                  <td className="p-4 text-gray-400">{t.by}</td>

                  <td className="p-4 text-red-600 font-semibold">
                    {t.blocked}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-500">{t.expires}</span>
                      {isExpired(t.expires) && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          Expired
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
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
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
          </div>

          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Token" : "Tambah Token"}
      >
        <FormGroup label="JTI Token">
          <Input value={form.jti} onChange={e => set("jti")(e.target.value)} />
        </FormGroup>

        <FormGroup label="User">
          <Input value={form.user} onChange={e => set("user")(e.target.value)} />
        </FormGroup>

        <FormGroup label="Alasan">
          <Input value={form.reason} onChange={e => set("reason")(e.target.value)} />
        </FormGroup>

        <FormGroup label="Diblokir Oleh">
          <Input value={form.by} onChange={e => set("by")(e.target.value)} />
        </FormGroup>

        <FormGroup label="Tanggal Blokir">
          <Input type="date" value={form.blocked} onChange={e => set("blocked")(e.target.value)} />
        </FormGroup>

        <FormGroup label="Tanggal Expire">
          <Input type="date" value={form.expires} onChange={e => set("expires")(e.target.value)} />
        </FormGroup>

        <Button onClick={handleSave}>Simpan</Button>
      </Modal>

      {/* DELETE */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus token?"
        desc="Token akan dihapus dari blacklist"
      />
    </div>
  );
}