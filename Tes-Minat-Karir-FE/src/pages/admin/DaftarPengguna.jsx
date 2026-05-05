import { useState, useEffect } from "react";
import { USERS as INITIAL_USERS } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import { useAdminPage } from "../../hooks/useAdminPage";

import Modal, { ConfirmModal } from "../../components/admin/Modal";
import {
  Avatar, Badge, Button, FormGrid, FormGroup, Input,
  Pagination, SearchInput, Select, StatCard, StatsGrid,
  Table, TableCard, TableHeader, Td, Tr,
} from "../../components/ui/UI";

const STATUS_LABEL = { active: "Aktif", inactive: "Nonaktif", blocked: "Diblokir" };
const ROLE_LABEL   = { admin: "Admin",  user: "User" };
const PAGE_SIZE    = 8;

const emptyForm = { fname: "", lname: "", email: "", password: "", role: "user", status: "active" };

export default function DaftarPengguna() {
  const toast = useToast();
  const { setActions } = useAdminPage();

  const [users,  setUsers]   = useState(INITIAL_USERS);
  const [search, setSearch]  = useState("");
  const [page,   setPage]    = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // 🔗 Inject ke Topbar
  useEffect(() => {
    setActions({
      onAdd: openCreate,
      onRefresh: () => toast("Data pengguna diperbarui", "info"),
    });
  }, []);

  const filtered = users.filter(u =>
    `${u.fname} ${u.lname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function handleSave() {
    if (!form.fname || !form.email) {
      toast("Nama dan email wajib diisi", "danger");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...form,
      joined: new Date().toLocaleDateString("id-ID"),
      tests: 0
    };

    setUsers(prev => [newUser, ...prev]);
    toast("Pengguna ditambahkan", "success");
    setFormOpen(false);
  }

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="flex min-h-screen bg-[#F7F7F7] font-sans">


    {/* MAIN */}
     <main className="ml-[240px] flex-1 flex flex-col">

      {/* TOPBAR */}
      <div className="h-14 bg-white border-b px-6 flex justify-between items-center">
        <div>
          <div className="font-bold text-sm">Daftar Pengguna</div>
          <div className="text-xs text-gray-500">Kelola semua pengguna sistem</div>
        </div>

        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded text-xs">↻ Refresh</button>
          <button
            onClick={openCreate}
            className="bg-[#854F0B] text-white px-3 py-1 rounded text-xs"
          >
            + Tambah Pengguna
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">TOTAL PENGGUNA</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">AKTIF</div>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status==="active").length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">ADMIN</div>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role==="admin").length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">NONAKTIF</div>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status!=="active").length}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border overflow-hidden">

          <div className="p-4 flex justify-between items-center border-b">
            <div className="font-bold">Semua Pengguna</div>

            <input
              className="bg-gray-100 border px-3 py-2 rounded text-xs w-[220px]"
              placeholder="🔍 Cari nama atau email..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>

          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 uppercase">
              <tr>
                <th className="p-3 text-left">Pengguna</th>
                <th className="p-3 text-left">Peran</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Bergabung</th>
                <th className="p-3 text-left">Tes</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50">

                  {/* USER */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FAEEDA] text-[#854F0B] rounded-full flex items-center justify-center text-xs font-bold">
                        {u.fname[0]}{u.lname[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {u.fname} {u.lname}
                        </div>
                        <div className="text-xs text-gray-400">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${u.role==="admin"
                        ? "bg-[#FAEEDA] text-[#854F0B]"
                        : "bg-blue-100 text-blue-600"}
                    `}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${u.status==="active" && "bg-green-100 text-green-600"}
                      ${u.status==="inactive" && "bg-gray-200 text-gray-600"}
                      ${u.status==="blocked" && "bg-red-100 text-red-600"}
                    `}>
                      {STATUS_LABEL[u.status]}
                    </span>
                  </td>

                  {/* BERGABUNG */}
                  <td className="p-3 text-gray-500 text-sm">
                    {u.joined || "-"}
                  </td>

                  {/* TES */}
                  <td className="p-3 font-semibold">
                    {u.tests ?? 0}
                  </td>

                  {/* AKSI */}
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1 border rounded">
                        Detail
                      </button>
                      <button className="text-xs px-3 py-1 border rounded">
                        Edit
                      </button>
                      <button className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded">
                        Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </main>
  </div>
  );
}