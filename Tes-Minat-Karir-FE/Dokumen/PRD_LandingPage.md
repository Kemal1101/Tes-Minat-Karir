# DOKUMEN PERSYARATAN PRODUK (PRD) - UI/UX LANDING PAGE (REVISI FINAL)

**Proyek:** Sistem Pakar Tes Minat Karir RIASEC  
**Tumpukan Teknologi:** React/Vite, Tailwind CSS, shadcn/ui, GSAP, Lenis  
**Gaya Desain:** Playful Glassmorphism (Struktur Layout: Tokyo Design Forum)

## 1. Identitas Visual & Atmosfer

- **Latar Belakang:** `#F7F7F7` (Abu-abu sangat muda) dengan elemen "Playful Blobs" organik berwarna `#F5B553` (Saffron) beropasitas 20% yang bergerak perlahan.
- **Teks Utama:** `#000000` (Hitam) untuk keterbacaan maksimal.
- **Aksen Utama:** `#854836` (Cokelat Rust) untuk tombol CTA.
- **Tipografi:** * **Host Grotesk:** Untuk judul (*Headings\*), paragraf, dan teks deskripsi.
  - **IBM Plex Mono:** Untuk lencana khusus, angka, label teknis, dan statistik.

---

## 2. Struktur Tata Letak Halaman (Top to Bottom)

### A. Bilah Navigasi Utama (Navbar)

- **Posisi:** `fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-50` (Mengambang layaknya pil/kapsul di atas).
- **Material:** `bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-full`.
- **Elemen:** Logo RIASEC di kiri menggunakan ukuran responsif `text-lg md:text-2xl` (Host Grotesk Extra Bold). Menu tersusun rata tengah dengan font `text-[11px] md:text-sm` font-semibold. Tidak ada efek _drop shadow_ pada teks sama sekali untuk menjaga kebersihan (_clean look_). Menu "Beranda" dan "Cara Kerja" disembunyikan di layar ponsel ultra-kecil (`hidden sm:block`) agar tidak sumpek. Di ujung kanan terdapat **Placeholder Foto Profil** berbentuk lingkaran presisi (`w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 border-2 border-white`).

### B. Bagian Utama (Hero Section)

- **1. Top Update Badge (Lencana Pembaruan Bersarang):**
  - **Desain (Meniru Referensi):** Menggunakan gaya _nested pill_ dengan _glassmorphism_. Pembungkus luar menggunakan latar belakang putih yang transparan, dan lencana "NEW" di bagian dalam berwarna solid.
  - **Container Luar:** `flex items-center gap-2 md:gap-4 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-full p-1 md:p-1.5 pr-4 md:pr-6`. 
  - **Pill Dalam ("NEW"):** `bg-appAccent text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest` (**Font:** IBM Plex Mono).
  - **Teks Sebelahnya:** "Sistem Terintegrasi Metode SAW & CF →" dengan ukuran teks proporsional (**Font:** Host Grotesk).
- **2. Dynamic Headline (Judul Utama - H1):**
  - **Ukuran Diperbesar:** Mengembalikan ke ukuran raksasa `text-[2.5rem] md:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] md:leading-[0.95] max-w-5xl mx-auto`. Tidak ada _drop shadow_ berlebihan, hanya warna hitam pekat (`text-black`).
  - **Perilaku Dinamis:** Teks H1 akan berubah secara acak (_randomize_) setiap kali _user_ memuat ulang (_refresh_) halaman. Berikut 5 daftar kalimatnya:
    1. _Eksplorasi Karir. Dirancang untuk Masa Depan._
    2. _Temukan Potensimu. Petakan Jalur Karirmu._
    3. _Kenali Minat Sejatimu. Bangun Karir Impianmu._
    4. _Langkah Pertama Menuju Karir yang Tepat._
    5. _Solusi Cerdas untuk Pemilihan Karir Anda._
- **3. Sub-headline (H2/p):**
  - Deskripsi singkat di bawah judul utama (`text-sm md:text-lg text-gray-600 max-w-2xl mx-auto`).
- **4. Tombol Call to Action (CTA):**
  - **Primary CTA ("Mulai Tes Sekarang" & "Berlangganan"):** Menggunakan latar belakang solid *Primary Accent* (`bg-appAccent`), teks putih tebal (`font-bold`), dan sudut `rounded-full`. 
  - **Efek Hover (Neon Light):** Tombol didesain minimalis tanpa ikon atau shadow gelembung berlebih. Saat di-hover, tombol akan terangkat sedikit ke atas dan memancarkan efek cahaya neon cokelat (`hover:shadow-[0_0_20px_rgba(133,72,54,0.6)]`), memberikan kesan bercahaya modern di atas desain flat. Semua desain tombol dibuat seragam.

### C. Bagian Tentang Tes (About Section)

- **Tata Letak:** Desain **Bento Grid** (Glassmorphism) yang sangat interaktif dan responsif (berubah menjadi kolom vertikal / _compact_ pada _mobile_). Sebelah kiri teks utama, sebelah kanan adalah grid berisi beberapa kartu saling melengkapi.
- **Konten Teks (Kiri):** _Headline:_ "Masa depan karir Anda, dihitung dengan presisi."
- **Konten Bento (Kanan):** Terdiri dari 3 kartu kaca (_glass cards_) yang dirancang **seragam/konsisten** dengan latar belakang semi-transparan (`bg-white/40`), efek _blur_, dan teks hitam tebal untuk menjaga visibilitas serta kesan modern:
  1. Kartu Lebar (Atas): Menampilkan integrasi teori Holland (RIASEC) dengan deskripsi singkat.
  2. Kartu Kecil (Kiri Bawah): Fokus pada algoritma komputasi (SAW & CF).
  3. Kartu Kecil (Kanan Bawah): Menampilkan label akurasi standar O*NET.
- Seluruh kartu memiliki efek _hover glow_ cokelat yang sama saat kursor diarahkan.

### D. Bagian Alur Kerja (How it Works)

- **Tata Letak:** 3 kolom sejajar atau desain garis waktu (_timeline_ vertikal) yang ringkas.
- **Langkah-langkah:**
  1. **Isi Kuesioner:** "Jawab 30 pertanyaan singkat yang dirancang khusus untuk memetakan preferensi aktivitas Anda."
  2. **Analisis Cerdas:** "Sistem memproses jawaban Anda menggunakan algoritma _Certainty Factor_ dan SAW secara _real-time_."
  3. **Rekomendasi Karir:** "Dapatkan 10 rekomendasi profesi teratas lengkap dengan persentase kecocokan minat Anda."
- **Animasi:** Masing-masing langkah muncul bergantian (_staggered fade-up_) saat di-scroll.

### E. Bagian Bukti Sosial / Statistik (Social Proof)

- **Tata Letak:** Angka super besar terpusat (_Centered oversized numbers_).
- **Tipografi:** Angka menggunakan **IBM Plex Mono** agar terlihat teknis dan presisi.
- **Konten:** * Angka: "1,200+" (Beranimasi *counter\* berjalan dari 0 ke angka tujuan menggunakan GSAP).
  - Teks: "Individu telah menemukan arah karir mereka melalui sistem ini."

### F. Bagian Berlangganan (Newsletter / Subscribe)

- **Tata Letak:** Kotak penahan (_container_) _glassmorphism_ di tengah layar dengan kontras tinggi.
- **Konten:** "Dapatkan pembaruan sistem dan wawasan karir terbaru."
- **Formulir:** Input email minimalis (tanpa _border_ tebal, hanya garis bawah atau _rounded-full_ tipis) bersanding dengan tombol _Submit_ kecil ("Berlangganan").

### G. Kaki Halaman (Footer)

- **Tata Letak:** Grid lebar dibagi menjadi 2-3 kolom.
- **Komponen:**
  - Kiri: Judul besar "RIASEC." (Host Grotesk) beserta deskripsi singkat sistem.
  - Tengah/Kanan: Tautan cepat (Tentang, Metode, Kontak, Login Admin).
  - Bawah: Garis pemisah tipis `border-t border-gray-300`, diakhiri dengan teks _Copyright_ ("© 2026 Kelompok 4 - D4 SIB Polinema") menggunakan font **IBM Plex Mono**.

---

## 3. Spesifikasi Animasi Utama (GSAP & Lenis)

1. **Lenis Global:** _Smooth scrolling_ diterapkan di `root` aplikasi agar navigasi antarseksi di _landing page_ terasa sangat mulus.
2. **ScrollTrigger Elements:** Setiap kali _user_ menggulir dari _Hero_ -> _About_ -> _How it Works_, konten akan muncul dengan transisi `y: 50, opacity: 0` menuju `y: 0, opacity: 1` secara perlahan.
3. **Stat Counter:** Pada seksi Statistik, _trigger_ GSAP akan menjalankan fungsi penghitung (_counter_) pada angka statistik ketika bagian tersebut terlihat minimal 50% di layar.
