import { useEffect, useState } from "react";
import gsap from "gsap";

const HEADLINE_OPTIONS = [
  "Eksplorasi Karir.\nDirancang untuk Masa Depan.",
  "Temukan Potensimu.\nPetakan Jalur Karirmu.",
  "Kenali Minat Sejatimu.\nBangun Karir Impianmu.",
  "Langkah Pertama Menuju\nKarir yang Tepat.",
  "Solusi Cerdas untuk\nPemilihan Karir Anda.",
];

export default function HeroSection() {
  const [headline, setHeadline] = useState(HEADLINE_OPTIONS[0]);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * HEADLINE_OPTIONS.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setHeadline(HEADLINE_OPTIONS[randomIdx]);

    // Playful Blobs Animation
    gsap.to(".blob", {
      x: "random(-30, 30, 5)",
      y: "random(-30, 30, 5)",
      rotation: "random(-45, 45)",
      scale: "random(0.9, 1.1)",
      duration: "random(4, 8)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        amount: 2,
        from: "random"
      }
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden pt-28 md:pt-32 pb-16 md:pb-20 bg-[#F7F7F7]"
    >
      {/* Background Playful Blobs */}
      <div id="blobs-container" className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="blob absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] max-w-[500px] max-h-[500px] bg-appBlob/30 rounded-full mix-blend-multiply filter blur-3xl opacity-80"></div>
        <div className="blob absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] max-w-[400px] max-h-[400px] bg-appAccent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-80"></div>
        <div className="blob absolute bottom-[-5%] left-[10%] w-[55vw] h-[55vw] md:w-[45vw] md:h-[45vw] max-w-[600px] max-h-[600px] bg-appBlob/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Top Update Badge */}
        <div className="flex items-center gap-2 md:gap-4 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-full p-1 md:p-1.5 pr-4 md:pr-6 cursor-pointer hover:bg-white/80 hover:scale-[1.03] transition-all duration-300 mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300">
          <span className="bg-appAccent text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono shadow-sm">
            NEW
          </span>
          <span className="text-[11px] sm:text-sm text-gray-800 font-bold tracking-tight">
            Sistem Terintegrasi Metode SAW & CF &rarr;
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-title text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight md:leading-[0.95] text-black w-full mb-4 md:mb-6 whitespace-pre-line">
          {headline}
        </h1>

        <p className="hero-desc text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-8 md:mb-10 px-2 md:px-0">
          Sistem Pakar Tes Minat Karir berbasis metode komputasi cerdas.
          Cepat, akurat, dan menghubungkan Anda dengan profesi global.
        </p>

        {/* CTA Button */}
        <div className="cta-group flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
          <button
            className="w-full sm:w-auto bg-appAccent text-white rounded-full px-8 py-3.5 md:py-4 text-sm md:text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(133,72,54,0.6)]"
          >
            Mulai Tes Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
