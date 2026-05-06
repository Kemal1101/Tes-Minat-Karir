import { useState, useEffect } from "react";
import { USERS as INITIAL_USERS } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";

import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Button, FormGrid, FormGroup, Input,
  Pagination, Select
} from "../../components/ui/UI";

const STATUS_LABEL = { active: "Aktif", inactive: "Nonaktif", blocked: "Diblokir" };
const ROLE_LABEL   = { admin: "Admin",  user: "User" };
const PAGE_SIZE    = 8;

const emptyForm = {
  fname: "", lname: "", email: "",
  role: "user", status: "active"
};

export default function DaftarPengguna() {
  const toast = useToast();
  const { setActions } = useAdminPage();

  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // 🔗 Topbar actions
  useEffect(() => {
    setActions({
      onAdd: openCreate,
      onRefresh: () => toast("Data diperbarui", "info"),
    });
  }, []);

  // 🔍 Filter
  const filtered = users.filter(u =>
    `${u.fname} ${u.lname} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 🧠 Actions
  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(user) {
    setEditingUser(user);
    setForm(user);
    setFormOpen(true);
  }

  function openDetail(user) {
    setSelectedUser(user);
    setDetailOpen(true);
  }

  function openDelete(user) {
    setSelectedUser(user);
    setDeleteOpen(true);
  }

  function handleSave() {
    if (!form.fname || !form.email) {
      toast("Nama dan email wajib diisi", "danger");
      return;
    }

    if (editingUser) {
      setUsers(prev =>
        prev.map(u => u.id === editingUser.id ? { ...u, ...form } : u)
      );
      toast("Pengguna diperbarui", "success");
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
        joined: new Date().toLocaleDateString("id-ID"),
        tests: 0
      };
      setUsers(prev => [newUser, ...prev]);
      toast("Pengguna ditambahkan", "success");
    }

    setFormOpen(false);
  }

  function handleDelete() {
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    toast("Pengguna dihapus", "danger");
  }

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="p-6 bg-[#f8f6f2] min-h-screen">

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="TOTAL PENGGUNA" value={users.length} badge="↑ 4 bulan ini" green />
        <Card title="AKTIF" value={users.filter(u => u.status === "active").length} badge="79%" green />
        <Card title="ADMIN" value={users.filter(u => u.role === "admin").length} badge="dari total" blue />
        <Card title="NONAKTIF" value={users.filter(u => u.status !== "active").length} badge="perlu tindak" red />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="font-semibold">Semua Pengguna</div>

          <input
            className="bg-gray-100 border px-4 py-2 rounded-full text-sm w-[260px]"
            placeholder="🔍 Cari nama atau email..."
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
              <th className="p-4 text-left">Peran</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Bergabung</th>
              <th className="p-4 text-left">Tes</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">

                {/* USER */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAEEDA] text-[#854F0B] flex items-center justify-center text-xs font-bold">
                      {u.fname[0]}{u.lname[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{u.fname} {u.lname}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${u.role === "admin"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"}`}>
                    {ROLE_LABEL[u.role]}
                  </span>
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${u.status === "active"
                      ? "bg-green-100 text-green-700"
                      : u.status === "blocked"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-200 text-gray-600"}`}>
                    {STATUS_LABEL[u.status]}
                  </span>
                </td>

                {/* JOIN */}
                <td className="p-4 text-gray-500">{u.joined}</td>

                {/* TEST */}
                <td className="p-4 font-semibold">{u.tests}</td>

                {/* ACTION */}
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openDetail(u)} className="text-xs px-3 py-1 border rounded-full">Detail</button>
                    <button onClick={() => openEdit(u)} className="text-xs px-3 py-1 border rounded-full">Edit</button>
                    <button onClick={() => openDelete(u)} className="text-xs px-3 py-1 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-full">Hapus</button>
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
            {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave}>Simpan</Button>
          </>
        }
      >
        <FormGrid>
          <FormGroup label="Nama Depan">
            <Input value={form.fname} onChange={e => set("fname")(e.target.value)} />
          </FormGroup>
          <FormGroup label="Nama Belakang">
            <Input value={form.lname} onChange={e => set("lname")(e.target.value)} />
          </FormGroup>
        </FormGrid>

        <FormGroup label="Email">
          <Input value={form.email} onChange={e => set("email")(e.target.value)} />
        </FormGroup>

        <FormGrid>
          <FormGroup label="Role">
            <Select value={form.role} onChange={set("role")}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>

          <FormGroup label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
              <option value="blocked">Diblokir</option>
            </Select>
          </FormGroup>
        </FormGrid>
      </Modal>

      {/* DETAIL */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Pengguna">
        {selectedUser && (
          <div className="space-y-2 text-sm">
            <div><b>Nama:</b> {selectedUser.fname} {selectedUser.lname}</div>
            <div><b>Email:</b> {selectedUser.email}</div>
            <div><b>Role:</b> {ROLE_LABEL[selectedUser.role]}</div>
            <div><b>Status:</b> {STATUS_LABEL[selectedUser.status]}</div>
            <div><b>Bergabung:</b> {selectedUser.joined}</div>
          </div>
        )}
      </Modal>

      {/* DELETE */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus pengguna?"
        desc="Data akan dihapus permanen."
      />

    </div>
  );
}

// 🔥 reusable stat card
function Card({ title, value, badge, green, blue, red }) {
  return (
    <div className="
      bg-white rounded-2xl p-5 border
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]
      cursor-pointer
    ">
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className="text-3xl font-bold">{value}</div>

      <span className={`text-xs px-2 py-1 rounded-full
        ${green && "bg-green-100 text-green-700"}
        ${blue && "bg-blue-100 text-blue-600"}
        ${red && "bg-red-100 text-red-600"}`}>
        {badge}
      </span>
    </div>
  );
}