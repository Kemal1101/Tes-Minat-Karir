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
    <div>
      <StatsGrid cols={4}>
        <StatCard label="Total" value={users.length} />
        <StatCard label="Aktif" value={users.filter(u => u.status==="active").length} />
        <StatCard label="Admin" value={users.filter(u => u.role==="admin").length} />
        <StatCard label="Nonaktif" value={users.filter(u => u.status!=="active").length} />
      </StatsGrid>

      <TableCard>
        <TableHeader title="Pengguna">
          <SearchInput value={search} onChange={v => setSearch(v)} />
        </TableHeader>

        <Table head={["Nama", "Role", "Status"]}>
          {paginated.map(u => (
            <Tr key={u.id}>
              <Td>{u.fname} {u.lname}</Td>
              <Td><Badge>{ROLE_LABEL[u.role]}</Badge></Td>
              <Td><Badge>{STATUS_LABEL[u.status]}</Badge></Td>
            </Tr>
          ))}
        </Table>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </TableCard>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah Pengguna"
        footer={
          <>
            <Button onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </>
        }
      >
        <FormGroup label="Nama">
          <Input value={form.fname} onChange={e => set("fname")(e.target.value)} />
        </FormGroup>
      </Modal>
    </div>
  );
}