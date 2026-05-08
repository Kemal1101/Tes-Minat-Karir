export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="reveal-section min-h-screen flex flex-col justify-center py-28 md:py-36 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 reveal-item">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
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
              className="reveal-item flex flex-col items-center text-center p-8 md:p-10 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(133,72,54,0.08)] hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center text-appAccent font-mono font-bold text-lg md:text-xl mb-6 shadow-md border border-white/80">
                {item.step}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">
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
