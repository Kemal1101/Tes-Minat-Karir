export default function HowItWorks() {
  return (
    <section id="how-it-works" className="reveal-section min-h-screen flex flex-col justify-center py-28 md:py-36 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 reveal-item">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-black">
            Bagaimana Sistem Bekerja
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Tiga langkah mudah menuju karir impian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {[
            {
              step: "01",
              title: "Isi Kuesioner",
              desc: "Jawab 30 pertanyaan singkat yang dirancang khusus untuk memetakan preferensi aktivitas Anda.",
            },
            {
              step: "02",
              title: "Analisis Cerdas",
              desc: "Sistem memproses jawaban Anda menggunakan algoritma Certainty Factor dan SAW secara real-time.",
            },
            {
              step: "03",
              title: "Rekomendasi Karir",
              desc: "Dapatkan 10 rekomendasi profesi teratas lengkap dengan persentase kecocokan minat Anda.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 md:p-10 bg-white/80 border border-white/50 rounded-3xl shadow-sm hover:shadow-[0_12px_32px_rgba(133,72,54,0.12)] transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center text-appAccent font-mono font-semibold text-lg md:text-xl mb-6 shadow-md border border-white/80">
                {item.step}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-black">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
