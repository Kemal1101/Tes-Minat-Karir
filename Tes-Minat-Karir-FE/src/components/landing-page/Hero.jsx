import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const HEADLINE_OPTIONS = [
  "Eksplorasi Karir.\nDirancang untuk Masa Depan.",
  "Temukan Potensimu.\nPetakan Jalur Karirmu.",
  "Kenali Minat Sejatimu.\nBangun Karir Impianmu.",
  "Langkah Pertama Menuju\nKarir yang Tepat.",
  "Solusi Cerdas untuk\nPemilihan Karir Anda.",
];

export default function Hero() {
  const [headline, setHeadline] = useState(HEADLINE_OPTIONS[0]);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * HEADLINE_OPTIONS.length);
    setHeadline(HEADLINE_OPTIONS[randomIdx]);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden pt-28 md:pt-32 pb-16 md:pb-20">
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <div className="flex items-center gap-2 md:gap-4 bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm rounded-full p-1 md:p-1.5 pr-4 md:pr-6 cursor-pointer hover:bg-white/60 hover:-translate-y-1 transition-all duration-300 mb-8 md:mb-12">
          <span className="bg-appAccent text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-mono shadow-sm">
            NEW
          </span>
          <span className="text-[11px] sm:text-sm text-gray-800 font-semibold tracking-tight">
            Sistem Terintegrasi Metode SAW & CF
          </span>
        </div>

        <h1 className="hero-title text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-semibold tracking-tight md:leading-[0.95] text-black w-full mb-6 md:mb-8 whitespace-pre-line">
          {headline}
        </h1>

        <p className="hero-desc text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-10 md:mb-14 px-2 md:px-0 leading-relaxed">
          Sistem Pakar Tes Minat Karir berbasis metode komputasi cerdas. Cepat,
          akurat, dan menghubungkan Anda dengan profesi global.
        </p>

        <div className="cta-group flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
          <Link to="/test" className="w-full sm:w-auto bg-appAccent text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold transition-opacity duration-300 hover:opacity-90 shadow-sm">
            Mulai Tes Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
