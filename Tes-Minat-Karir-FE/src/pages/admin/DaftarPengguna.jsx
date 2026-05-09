import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";
import { api } from "../../lib/api";

import Modal, { ConfirmModal } from "../../components/admin/Modal";
import { RefreshCw, Plus } from "lucide-react";
import {
  Button, FormGrid, FormGroup, Input,
  Pagination, Select
} from "../../components/ui/UI";

const STATUS_LABEL = { active: "Aktif", inactive: "Nonaktif", blocked: "Diblokir" };
const ROLE_LABEL   = { admin: "Admin",  user: "User" };
const PAGE_SIZE    = 8;
const icons = {
  refresh: RefreshCw,
  add: Plus,
};
const emptyForm = {
  username: "", 
  nama_lengkap: "",
  password: "",
  role: "user", 
  status: "active"
};

export default function DaftarPengguna() {
  const toast = useToast();
  const { setActions } = useAdminPage();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState(emptyForm);
  // 🔗 Dynamic Topbar
  const topbar = {
    title: "Daftar Pengguna",

    subtitle: "Kelola semua pengguna sistem",

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
        label: "Tambah Pengguna",
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
  
  useEffect (() => {
    loadUsers();
    setActions({
      onAdd: openCreate,
      onRefresh: () => {
        loadUsers();
        toast("Data diperbarui", "info");
      },
    });
  }, []);

  const loadUsers = async () => {
    try {
      const result = await api.getUsers();
      const mapped = result.map(u => ({
        id: u.id,
        username: u.username,
        nama_lengkap: u.nama_lengkap || "",
        role: u.role || "user",
        status: "active",
      }));
      setUsers(mapped);
    } catch (err) {
      toast("Gagal memuat pengguna", "danger");
      console.error(err);
    }
  };

  // 🔍 Filter
  const filtered = users.filter(u =>
    `${u.nama_lengkap} ${u.username}`
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
    setForm({
      ...user,
      password: "" // Don't show existing password
    });
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

  async function handleSave() {
    if (!form.username) {
      toast("Username wajib diisi", "danger");
      return;
    }

    try {
      const payload = {
        username: form.username,
        nama_lengkap: form.nama_lengkap.trim(),
        role: form.role
      };

      if (editingUser) {
        if (form.password) payload.password = form.password;
        await api.updateUser(editingUser.id, payload);
        toast("Pengguna diperbarui", "success");
      } else {
        if (!form.password) {
          toast("Password wajib diisi untuk pengguna baru", "danger");
          return;
        }
        payload.password = form.password;
        await api.createUser(payload);
        toast("Pengguna ditambahkan", "success");
      }
      
      loadUsers();
      setFormOpen(false);
    } catch (err) {
      toast("Gagal menyimpan pengguna", "danger");
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteUser(selectedUser.id);
      toast("Pengguna dihapus", "danger");
      loadUsers();
      setDeleteOpen(false);
    } catch (err) {
      toast("Gagal menghapus pengguna", "danger");
      console.error(err);
    }
  }

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

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
        <Card title="TOTAL PENGGUNA" value={users.length} badge="↑ 4 bulan ini" green />
        <Card title="AKTIF" value={users.filter(u => u.status === "active").length} badge="79%" green />
        <Card title="ADMIN" value={users.filter(u => u.role === "admin").length} badge="dari total" blue />
        <Card title="NONAKTIF" value={users.filter(u => u.status !== "active").length} badge="perlu tindakan" red />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-bg-[#f8f6f2] overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="font-semibold">Semua Pengguna</div>

          <div className="flex gap-3 items-center">
            <input
              className="bg-gray-100 border px-4 py-2 rounded-full text-sm w-[260px]"
              placeholder="🔍 Cari nama atau username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <button
              onClick={openCreate}
              className="bg-black text-white px-4 py-2 rounded-full text-sm"
            >
              + Tambah
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 uppercase">
            <tr>
              <th className="p-4 text-left">Pengguna</th>
              <th className="p-4 text-left">Peran</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">

                {/* USER */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAEEDA] text-[#854F0B] flex items-center justify-center text-xs font-bold uppercase">
                      {(u.nama_lengkap || u.username).substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{u.nama_lengkap || "-"}</div>
                      <div className="text-xs text-gray-400">{u.username}</div>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${u.role === "admin"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"}`}>
                    {ROLE_LABEL[u.role] || u.role}
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
        <FormGroup label="Nama Lengkap">
          <Input 
            value={form.nama_lengkap} 
            onChange={e => set("nama_lengkap")(e.target.value)} 
            placeholder="John Doe"
          />
        </FormGroup>

        <FormGroup label="Username">
          <Input 
            value={form.username} 
            onChange={e => set("username")(e.target.value)} 
            placeholder="johndoe"
          />
        </FormGroup>

        <FormGroup label={editingUser ? "Password Baru (opsional)" : "Password"}>
          <Input 
            type="password" 
            placeholder={editingUser ? "Kosongkan jika tidak ingin ganti" : "password123"} 
            value={form.password} 
            onChange={e => set("password")(e.target.value)} 
          />
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
            <div><b>Nama Lengkap:</b> {selectedUser.nama_lengkap || "-"}</div>
            <div><b>Username:</b> {selectedUser.username}</div>
            <div><b>Role:</b> {ROLE_LABEL[selectedUser.role] || selectedUser.role}</div>
            <div><b>Status:</b> {STATUS_LABEL[selectedUser.status]}</div>
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
    </>
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
