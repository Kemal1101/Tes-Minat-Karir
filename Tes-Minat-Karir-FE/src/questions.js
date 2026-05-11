// questions.js
export const questions = [
  { id: 1, text: "Memperbaiki mesin atau peralatan", category: "R" },
  { id: 2, text: "Penelitian ilmiah di laboratorium", category: "I" },
  { id: 3, text: "Menulis cerita, puisi, atau lagu", category: "A" },
  { id: 4, text: "Membantu orang yang sedang mengalami masalah", category: "S" },
  { id: 5, text: "Memimpin tim atau proyek", category: "E" },
  { id: 6, text: "Mengatur data, arsip, atau jadwal", category: "C" },
  { id: 7, text: "Bekerja dengan tangan (kayu, logam, dll)", category: "R" },
  { id: 8, text: "Membaca tentang teori dan konsep baru", category: "I" },
  { id: 9, text: "Mendesain sesuatu yang artistik", category: "A" },
  { id: 10, text: "Mengajar atau melatih orang lain", category: "S" },
  
  { id: 11, text: "Menjual ide atau produk kepada orang lain", category: "E" },
  { id: 12, text: "Mengelola keuangan atau administrasi", category: "C" },
  { id: 13, text: "Membangun atau merakit sesuatu", category: "R" },
  { id: 14, text: "Melakukan eksperimen", category: "I" },
  { id: 15, text: "Berakting atau performing di depan orang", category: "A" },
  { id: 16, text: "Memberi konseling atau nasihat", category: "S" },
  { id: 17, text: "Memulai bisnis sendiri", category: "E" },
  { id: 18, text: "Menjaga ketertiban dan aturan", category: "C" },
  { id: 19, text: "Bekerja di luar ruangan dengan alam", category: "R" },
  { id: 20, text: "Menganalisis data dan pola", category: "I" },
  
  { id: 21, text: "Menggambar atau melukis", category: "A" },
  { id: 22, text: "Merawat orang sakit atau lansia", category: "S" },
  { id: 23, text: "Bernegosiasi atau berdebat", category: "E" },
  { id: 24, text: "Menyusun laporan yang rapi dan terstruktur", category: "C" },
  { id: 25, text: "Mengoperasikan mesin berat", category: "R" },
  { id: 26, text: "Mempelajari bahasa asing atau filsafat", category: "I" },
  { id: 27, text: "Membuat konten kreatif (video, foto, dll)", category: "A" },
  { id: 28, text: "Bekerja sebagai relawan sosial", category: "S" },
  { id: 29, text: "Memotivasi orang lain untuk mencapai target", category: "E" },
  { id: 30, text: "Mengelola dokumen dan sistem informasi", category: "C" },
];

export const riasecData = {
  R: { 
    name: "Realistic", 
    description: "Suka bekerja dengan tangan, mesin, dan hal-hal praktis.", 
    careers: ["Teknik Mesin", "Arsitek", "Petani", "Montir", "Pilot", "Chef"] 
  },
  I: { 
    name: "Investigative", 
    description: "Suka berpikir analitis, riset, dan memecahkan masalah kompleks.", 
    careers: ["Ilmuwan", "Dokter", "Programmer", "Peneliti", "Psikolog", "Matematikawan"] 
  },
  A: { 
    name: "Artistic", 
    description: "Kreatif, suka mengekspresikan diri melalui seni dan desain.", 
    careers: ["Desainer Grafis", "Penulis", "Musician", "Fotografer", "Sutradara", "Animator"] 
  },
  S: { 
    name: "Social", 
    description: "Suka membantu, mengajar, dan berinteraksi dengan orang lain.", 
    careers: ["Guru", "Dokter Umum", "Psikolog", "Social Worker", "HRD", "Perawat"] 
  },
  E: { 
    name: "Enterprising", 
    description: "Suka memimpin, berbisnis, dan mempengaruhi orang lain.", 
    careers: ["Pengusaha", "Manajer", "Marketing", "Sales Manager", "Polisi", "Advokat"] 
  },
  C: { 
    name: "Conventional", 
    description: "Suka bekerja dengan data, angka, dan mengikuti prosedur yang jelas.", 
    careers: ["Akuntan", "Admin", "Bankir", "Sekretaris", "Data Analyst", "Auditor"] 
  }
};