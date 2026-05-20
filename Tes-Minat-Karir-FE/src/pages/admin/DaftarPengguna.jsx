import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await api.getUsers();
      return result.map(u => ({
        id: u.id,
        username: u.username,
        nama_lengkap: u.nama_lengkap || "",
        role: u.role || "user",
        status: "active",
      }));
    }
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // 🔗 Dynamic Topbar
  const topbar = {
    title: "Daftar Pengguna",

    subtitle: "Kelola semua pengguna sistem",

    actions: [],
  };

  useEffect(() => {
    setActions({
      onAdd: openCreate,
    });

    return () => {
      setActions(null);
    };
   }, []);

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

    setIsSaving(true);
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
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setFormOpen(false);
    } catch (err) {
      toast("Gagal menyimpan pengguna", "danger");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await api.deleteUser(selectedUser.id);
      toast("Pengguna dihapus", "danger");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteOpen(false);
    } catch (err) {
      toast("Gagal menghapus pengguna", "danger");
      console.error(err);
    } finally {
      setIsDeleting(false);
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
            <button onClick={openCreate} className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white transition-all">
              <Plus size={16} />
              Tambah
            </button>
            <input
              className="bg-gray-100 border px-4 py-2 rounded-full text-sm w-[260px]"
              placeholder="🔍 Cari nama atau username..."
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
              <th className="p-4 text-left">Pengguna</th>
              <th className="p-4 text-left">Peran</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse bg-gray-50/50">
                  <td className="p-4"><div className="flex gap-3"><div className="w-9 h-9 bg-gray-200 rounded-full"></div><div><div className="h-4 bg-gray-200 rounded w-24 mb-1"></div><div className="h-3 bg-gray-200 rounded w-16"></div></div></div></td>
                  <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="p-4"><div className="h-6 w-16 bg-gray-200 rounded-full"></div></td>
                  <td className="p-4"><div className="h-8 bg-gray-200 rounded w-32"></div></td>
                </tr>
              ))}
            </tbody>
          ) : (
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
          )}
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
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={isSaving}>Batal</Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? "Memproses..." : "Simpan"}</Button>
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
        isDeleting={isDeleting}
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
