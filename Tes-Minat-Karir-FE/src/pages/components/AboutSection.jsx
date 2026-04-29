export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
        <div className="lg:col-span-5 reveal-item lg:pr-8 mb-8 lg:mb-0 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-black">
            Masa depan karir Anda, dihitung dengan presisi.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
            Bukan sekadar tes kepribadian biasa. Sistem kami menggabungkan
            teori psikologi mendalam dengan metode komputasi sistem pakar
            tingkat lanjut.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bento-card sm:col-span-2 bg-white/40 backdrop-blur-md border border-white/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(133,72,54,0.15)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-appBlob/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-appBlob/40 transition-colors"></div>
            <div className="w-12 h-12 rounded-full bg-appAccent/10 flex items-center justify-center mb-6">
              <span className="text-appAccent font-bold text-xl">R</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-black">
              Teori Psikologi Holland
            </h3>
            <p className="text-gray-600 font-medium">
              Menganalisis profil kepribadian Anda berdasarkan 6 dimensi
              RIASEC (Realistic, Investigative, Artistic, Social,
              Enterprising, Conventional).
            </p>
          </div>

          <div className="bento-card bg-white/40 backdrop-blur-md border border-white/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(133,72,54,0.15)] transition-all duration-300">
            <h3 className="text-xl font-bold mb-2 text-black">
              Algoritma Ganda
            </h3>
            <p className="text-gray-600 text-sm font-medium">
              Kombinasi SAW (Simple Additive Weighting) & CF (Certainty
              Factor) untuk perhitungan mutlak.
            </p>
          </div>

          <div className="bento-card bg-white/40 backdrop-blur-md border border-white/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(133,72,54,0.15)] transition-all duration-300 group">
            <h3 className="text-xl font-bold mb-2 text-black">
              Standar O*NET
            </h3>
            <p className="text-gray-600 text-sm font-medium">
              Database profesi internasional dengan akurasi pemetaan
              kompetensi tertinggi.
            </p>
            <div className="mt-6 flex justify-end">
              <span className="text-appAccent group-hover:translate-x-2 transition-transform duration-300 font-bold">
                &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
