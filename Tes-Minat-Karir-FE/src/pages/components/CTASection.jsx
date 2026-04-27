import { useEffect, useRef } from "react";
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
        className="py-24 md:py-32 px-4 md:px-8 flex flex-col items-center justify-center text-center"
      >
        <h2
          ref={counterRef}
          className="text-7xl md:text-8xl lg:text-[10rem] font-bold font-mono tracking-tighter text-black mb-4"
        >
          0
        </h2>
        <p className="text-lg md:text-2xl text-gray-600 font-medium max-w-2xl px-4">
          Individu telah menemukan arah karir mereka melalui sistem ini.
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 md:p-16 text-center shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-black">
            Tetap Terhubung
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium mb-8 md:mb-10">
            Dapatkan pembaruan sistem dan wawasan karir terbaru.
          </p>

          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Masukkan alamat email Anda"
              className="w-full sm:flex-1 bg-white/50 backdrop-blur-sm border border-gray-300 focus:border-appAccent focus:ring-2 focus:ring-appAccent/20 rounded-full px-6 py-4 outline-none transition-all text-black placeholder:text-gray-500 font-medium"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-appAccent text-white px-8 py-3.5 md:py-4 rounded-full text-sm md:text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(133,72,54,0.6)] whitespace-nowrap"
            >
              Berlangganan
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
