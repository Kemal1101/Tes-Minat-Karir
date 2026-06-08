import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SocialProofSubscribe() {
  const counterRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
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
      <section id="social-proof" className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 md:px-8">
        <h2 ref={counterRef} className="text-7xl md:text-8xl lg:text-[10rem] font-semibold font-mono tracking-tighter text-black mb-4 drop-shadow-sm">
          0
        </h2>
        <p className="text-lg md:text-2xl text-gray-800 font-medium max-w-2xl px-4">
          Individu telah menemukan arah karir mereka melalui sistem ini.
        </p>
      </section>

      <section className="flex flex-col items-center justify-center py-20 md:py-32 px-4 md:px-8">
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
    </>
  );
}
