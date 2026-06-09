import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SocialProof() {
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
    <section id="social-proof" className="relative min-h-screen flex flex-col items-center justify-center py-20 text-center px-4 md:px-8">
      <h2 ref={counterRef} className="text-7xl md:text-8xl lg:text-[10rem] font-semibold font-mono tracking-tighter text-black mb-4 drop-shadow-sm">
        0
      </h2>
      <p className="text-lg md:text-2xl text-gray-800 font-medium max-w-2xl px-4">
        Individu telah menemukan arah karir mereka melalui sistem ini.
      </p>
    </section>
  );
}
