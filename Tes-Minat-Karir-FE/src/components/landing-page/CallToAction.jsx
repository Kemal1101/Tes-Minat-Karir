import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 md:px-8">
      <div className="relative max-w-4xl w-full mx-auto bg-white/80 border border-white/50 rounded-[3rem] p-12 md:p-24 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
        <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-black">
          Siap Menemukan Arah Karir?
        </h2>
        <p className="relative z-10 text-lg md:text-xl text-gray-800 font-medium mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Mulai tes sekarang dan dapatkan rekomendasi karir yang akurat sesuai dengan preferensi aktivitas Anda.
        </p>

        <Link to="/test" className="relative z-10 inline-block bg-appAccent text-white px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(133,72,54,0.3)] whitespace-nowrap">
          Mulai Tes Sekarang
        </Link>
      </div>
    </section>
  );
}
