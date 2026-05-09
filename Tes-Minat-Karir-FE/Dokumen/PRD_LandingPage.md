# PRD - UI/UX Landing Page

**Proyek:** Sistem Pakar Tes Minat Karir RIASEC  
**Tech Stack:** React/Vite, Tailwind CSS, shadcn/ui, GSAP, Lenis  
**Gaya Desain:** Playful Glassmorphism

---

## 1. Identitas Visual

- **Latar Belakang:** `#F7F7F7` (Abu-abu muda).
- **Elemen Dekoratif:** "Playful Blobs" organik `#F5B553` (Saffron) opacity 20%.
- **Teks Utama:** `#000000` (Hitam pekat).
- **Warna Aksen:** `#854836` (Cokelat Rust) untuk CTA / Tombol.
- **Tipografi:**
  - **Host Grotesk:** Judul, paragraf, deskripsi.
  - **IBM Plex Mono:** Angka statis/dinamis, label teknis.

---

## 2. Struktur Tata Letak

### A. Navbar

- **Posisi:** Mengambang di atas (_fixed_), _glassmorphism_, terpusat.
- **Isi:** Logo "RIASEC", Menu (Beranda, Tentang Tes, Cara Kerja), dan Placeholder Foto Profil bulat.

### B. Hero Section

- **Lencana (Badge):** Desain _nested pill_ (tulisan "NEW" dan teks "Sistem Terintegrasi Metode SAW & CF").
- **Headline (H1):** Ukuran raksasa, kalimatnya diacak dari 5 opsi berbeda setiap kali halaman dimuat ulang.
- **Tombol CTA Utama:** "Mulai Tes Sekarang" dengan efek _hover glow_ (neon cokelat) tanpa shadow berlebih saat diam.

### C. About Section (Tentang Tes)

- **Tata Letak:** Bento Grid. Kiri untuk Teks Headline, Kanan untuk 3 Kartu.
- **Kartu (_Glass Cards_):**
  1. Teori Psikologi Holland (Lebar)
  2. Algoritma Ganda (Kecil)
  3. Standar O\*NET (Kecil)
- Seluruh kartu berlatar semi-transparan dengan efek hover cokelat tipis.

### D. How It Works (Cara Kerja)

- **Tata Letak:** 3 kolom langkah sejajar (Isi Kuesioner -> Analisis Cerdas -> Rekomendasi Karir).
- **Animasi:** Muncul berurutan (_staggered reveal_) saat di-scroll.

### E. Social Proof & Subscribe

- **Statistik:** Angka besar (font mono) yang berjalan dari 0 ke "1,200+".
- **Berlangganan:** Kotak _glassmorphism_ di tengah. Memuat teks "Dapatkan pembaruan sistem..." beserta **Formulir Input Email** minimalis dan tombol "Berlangganan".

### F. Footer

- **Tata Letak:** Grid responsif dibagi menjadi Logo & Deskripsi, Tautan Cepat, dan Bantuan.
- **Bawah:** Teks hak cipta font mono dan ikon tautan sosial media.

---

## 3. Spesifikasi Animasi

- **Lenis:** _Smooth scrolling_ pada tingkat _root_ agar navigasi halus.
- **GSAP ScrollTrigger:** Animasi transisi _fade-up_ saat elemen mulai masuk viewport.
- **GSAP Counter:** Animasi penghitung berjalan khusus untuk angka statistik "1,200+".
