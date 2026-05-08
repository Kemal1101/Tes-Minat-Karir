export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center py-24 md:py-32 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5 reveal-item lg:pr-8 mb-10 lg:mb-0 text-center lg:text-left flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-black">
            Masa depan karir Anda, dihitung dengan presisi.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
            Bukan sekadar tes kepribadian biasa. Sistem kami menggabungkan teori
            psikologi mendalam dengan metode komputasi sistem pakar tingkat
            lanjut.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <div className="bento-card sm:col-span-2 bg-[#F9F9F9]/80 border border-black/5 p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-[0_12px_32px_rgba(133,72,54,0.08)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-appBlob/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-appBlob/40 transition-colors"></div>
            <div className="w-12 h-12 rounded-full bg-appAccent/10 flex items-center justify-center mb-6">
              <span className="text-appAccent font-bold text-xl">R</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-black">
              Teori Psikologi Holland
            </h3>
            <p className="text-gray-600 font-medium">
              Menganalisis profil kepribadian Anda berdasarkan 6 dimensi RIASEC
              (Realistic, Investigative, Artistic, Social, Enterprising,
              Conventional).
            </p>
          </div>

          <div className="bento-card bg-[#F9F9F9]/80 border border-black/5 p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-[0_12px_32px_rgba(133,72,54,0.08)] transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-black">
              Algoritma Ganda
            </h3>
            <p className="text-gray-600 text-sm font-medium">
              Kombinasi SAW (Simple Additive Weighting) & CF (Certainty Factor)
              untuk perhitungan mutlak.
            </p>
          </div>

          <div className="bento-card bg-[#F9F9F9]/80 border border-black/5 p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-[0_12px_32px_rgba(133,72,54,0.08)] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-3 text-black">
                Standar O*NET
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                Database profesi internasional dengan akurasi pemetaan
                kompetensi tertinggi.
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <span className="text-appAccent group-hover:translate-x-2 transition-transform duration-300 font-bold text-lg">
                &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
