import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const counterRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // STAT COUNTER ANIMATION
      const counterTarget = { val: 0 };
      gsap.to(counterTarget, {
        val: 1200,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#social-proof",
          start: "top 80%",
        },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent =
              Math.floor(counterTarget.val).toLocaleString() + "+";
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="social-proof"
        className="relative py-24 md:py-32 px-4 md:px-8 flex flex-col items-center justify-center text-center"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-appBlob/10 rounded-full blur-[80px] -z-10"></div>
        <h2
          ref={counterRef}
          className="text-7xl md:text-8xl lg:text-[10rem] font-bold font-mono tracking-tighter text-black mb-4 drop-shadow-sm"
        >
          0
        </h2>
        <p className="text-lg md:text-2xl text-gray-600 font-medium max-w-2xl px-4">
          Individu telah menemukan arah karir mereka melalui sistem ini.
        </p>
      </section>

      <section className="min-h-screen flex flex-col justify-center py-24 md:py-32 px-4 md:px-8">
        <div className="relative max-w-4xl w-full mx-auto bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-12 md:p-24 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-appAccent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-appBlob/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-black">
            Siap Menemukan Arah Karir?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Mulai tes sekarang dan dapatkan rekomendasi karir yang akurat sesuai
            dengan preferensi aktivitas Anda.
          </p>

          <Link
            to="/test"
            className="inline-block relative z-10 bg-appAccent text-white px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(133,72,54,0.3)] whitespace-nowrap text-center"
          >
            Mulai Tes Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
