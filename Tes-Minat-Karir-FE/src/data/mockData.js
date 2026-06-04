// ─── USERS ────────────────────────────────────────────────────────────────────
export const USERS = [
  { id: 1,  fname: 'Andi',   lname: 'Prasetyo',   email: 'andi@email.com',   role: 'user',  status: 'active',   joined: '12 Jan 2025', tests: 3 },
  { id: 2,  fname: 'Siti',   lname: 'Rahayu',     email: 'siti@email.com',   role: 'user',  status: 'active',   joined: '18 Jan 2025', tests: 1 },
  { id: 3,  fname: 'Budi',   lname: 'Santoso',    email: 'budi@email.com',   role: 'admin', status: 'active',   joined: '5 Feb 2025',  tests: 0 },
  { id: 4,  fname: 'Dewi',   lname: 'Kurniawan',  email: 'dewi@email.com',   role: 'user',  status: 'inactive', joined: '20 Feb 2025', tests: 2 },
  { id: 5,  fname: 'Fajar',  lname: 'Nugroho',    email: 'fajar@email.com',  role: 'user',  status: 'active',   joined: '3 Mar 2025',  tests: 4 },
  { id: 6,  fname: 'Laila',  lname: 'Hasanah',    email: 'laila@email.com',  role: 'user',  status: 'active',   joined: '15 Mar 2025', tests: 1 },
  { id: 7,  fname: 'Rizki',  lname: 'Pratama',    email: 'rizki@email.com',  role: 'user',  status: 'blocked',  joined: '22 Mar 2025', tests: 0 },
  { id: 8,  fname: 'Maya',   lname: 'Indrawati',  email: 'maya@email.com',   role: 'user',  status: 'active',   joined: '1 Apr 2025',  tests: 2 },
  { id: 9,  fname: 'Ahmad',  lname: 'Fauzi',      email: 'ahmad@email.com',  role: 'user',  status: 'inactive', joined: '5 Apr 2025',  tests: 1 },
  { id: 10, fname: 'Rina',   lname: 'Marlina',    email: 'rina@email.com',   role: 'user',  status: 'active',   joined: '10 Apr 2025', tests: 5 },
];

// ─── TEST HISTORY ─────────────────────────────────────────────────────────────
export const TEST_HISTORY = [
  { id: 1,  user: 'Andi Prasetyo',  userId: 1,  type: 'SAI', saw: 0.87, cf: 0.82, career: 'Software Engineer',   date: '15 Apr 2025' },
  { id: 2,  user: 'Maya Indrawati', userId: 8,  type: 'AES', saw: 0.79, cf: 0.75, career: 'UI/UX Designer',      date: '16 Apr 2025' },
  { id: 3,  user: 'Fajar Nugroho',  userId: 5,  type: 'RIC', saw: 0.91, cf: 0.88, career: 'Civil Engineer',      date: '17 Apr 2025' },
  { id: 4,  user: 'Siti Rahayu',    userId: 2,  type: 'SCE', saw: 0.73, cf: 0.71, career: 'HR Manager',          date: '18 Apr 2025' },
  { id: 5,  user: 'Dewi Kurniawan', userId: 4,  type: 'IAS', saw: 0.84, cf: 0.80, career: 'Data Scientist',      date: '19 Apr 2025' },
  { id: 6,  user: 'Laila Hasanah',  userId: 6,  type: 'SEA', saw: 0.76, cf: 0.72, career: 'Marketing Manager',   date: '20 Apr 2025' },
  { id: 7,  user: 'Ahmad Fauzi',    userId: 9,  type: 'ECS', saw: 0.68, cf: 0.65, career: 'Business Analyst',    date: '21 Apr 2025' },
  { id: 8,  user: 'Rina Marlina',   userId: 10, type: 'CIS', saw: 0.82, cf: 0.79, career: 'Accountant',          date: '22 Apr 2025' },
];

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
export const QUESTIONS = [
  { id:  1, text: 'Saya suka memperbaiki atau membangun sesuatu dengan tangan saya.',         type: 'R', saw: 0.167, cf: 0.5 },
  { id:  2, text: 'Saya menikmati memecahkan masalah ilmiah atau matematis yang kompleks.',   type: 'I', saw: 0.167, cf: 0.5 },
  { id:  3, text: 'Saya suka menciptakan karya seni, musik, atau tulisan kreatif.',           type: 'A', saw: 0.167, cf: 0.5 },
  { id:  4, text: 'Saya senang membantu dan mengajar orang lain.',                            type: 'S', saw: 0.167, cf: 0.5 },
  { id:  5, text: 'Saya menikmati memimpin tim dan mengambil keputusan bisnis.',              type: 'E', saw: 0.167, cf: 0.5 },
  { id:  6, text: 'Saya lebih suka pekerjaan yang terstruktur dengan prosedur yang jelas.',   type: 'C', saw: 0.167, cf: 0.5 },
  { id:  7, text: 'Saya tertarik bekerja dengan mesin, peralatan, atau teknologi fisik.',     type: 'R', saw: 0.167, cf: 0.5 },
  { id:  8, text: 'Saya suka menganalisis data dan menemukan pola tersembunyi.',              type: 'I', saw: 0.167, cf: 0.5 },
  { id:  9, text: 'Saya menikmati improvisasi dan ekspresi diri melalui karya.',              type: 'A', saw: 0.167, cf: 0.5 },
  { id: 10, text: 'Saya mudah berempati dan senang bekerja dalam tim yang beragam.',          type: 'S', saw: 0.167, cf: 0.5 },
];

// ─── OCCUPATIONS ──────────────────────────────────────────────────────────────
export const OCCUPATIONS = [
  { id: 1, name: 'Software Engineer',    onet: '15-1252.00', holland: 'I', sector: 'Teknologi Informasi', saw: 0.88, desc: 'Merancang, mengembangkan, dan memelihara sistem perangkat lunak.' },
  { id: 2, name: 'UX/UI Designer',       onet: '27-1021.00', holland: 'A', sector: 'Seni & Desain',       saw: 0.82, desc: 'Menciptakan pengalaman pengguna yang intuitif dan estetis.' },
  { id: 3, name: 'Data Scientist',       onet: '15-2051.00', holland: 'I', sector: 'Teknologi Informasi', saw: 0.91, desc: 'Menganalisis data besar untuk menghasilkan insight bisnis.' },
  { id: 4, name: 'HR Manager',           onet: '11-3121.00', holland: 'S', sector: 'Manajemen SDM',       saw: 0.76, desc: 'Mengelola rekrutmen, pelatihan, dan kesejahteraan karyawan.' },
  { id: 5, name: 'Civil Engineer',       onet: '17-2051.00', holland: 'R', sector: 'Teknik',              saw: 0.85, desc: 'Merancang dan mengawasi pembangunan infrastruktur.' },
  { id: 6, name: 'Business Analyst',     onet: '13-1111.00', holland: 'E', sector: 'Keuangan',            saw: 0.79, desc: 'Menganalisis proses bisnis dan memberikan rekomendasi.' },
  { id: 7, name: 'Accountant',           onet: '13-2011.00', holland: 'C', sector: 'Keuangan',            saw: 0.83, desc: 'Mengelola laporan keuangan dan memastikan kepatuhan pajak.' },
  { id: 8, name: 'Graphic Designer',     onet: '27-1024.00', holland: 'A', sector: 'Seni & Desain',       saw: 0.77, desc: 'Menciptakan materi visual untuk komunikasi dan branding.' },
];

// ─── TOKEN BLACKLIST ───────────────────────────────────────────────────────────
export const TOKEN_BLACKLIST = [
  { id: 1, jti: 'eyJhbGciOiJIUzI1NiJ9.abc123', user: 'Rizki Pratama',  userId: 7,  reason: 'Login paksa dari device lain',     by: 'Super Admin', blocked: '22 Mar 2025', expires: '22 Apr 2025' },
  { id: 2, jti: 'eyJhbGciOiJIUzI1NiJ9.xyz789', user: 'Ahmad Fauzi',   userId: 9,  reason: 'Akun dilaporkan mencurigakan',      by: 'Super Admin', blocked: '10 Apr 2025', expires: '10 May 2025' },
  { id: 3, jti: 'eyJhbGciOiJIUzI1NiJ9.def456', user: 'Toni Hidayat',  userId: 11, reason: 'Reset password manual oleh admin',  by: 'Super Admin', blocked: '20 Apr 2025', expires: '20 May 2025' },
];
