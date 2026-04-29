import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".footer-item", {
        scrollTrigger: { trigger: "#footer", start: "top 90%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    if (lenis) {
      lenis.scrollTo(targetId, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="border-t border-gray-200 pt-16 pb-8 px-6 md:px-12 mt-8 md:mt-12 bg-appBg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16 footer-item">
        <div className="md:col-span-5">
          <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-black">
            RIASEC.
          </h3>
          <p className="text-gray-500 max-w-md font-medium leading-relaxed">
            Sistem Pakar Tes Minat Karir komprehensif. Menghubungkan potensi
            individu dengan standar karir global O*NET melalui algoritma cerdas.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h4 className="font-bold mb-4 text-black">Tautan Cepat</h4>
          <ul className="space-y-3 text-gray-500 font-medium">
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-appAccent transition-colors">
                Tentang Sistem
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, "#how-it-works")} className="hover:text-appAccent transition-colors">
                Metode SAW & CF
              </a>
            </li>
            <li>
              <a href="#footer" onClick={(e) => handleNavClick(e, "#footer")} className="hover:text-appAccent transition-colors">
                Kontak Kami
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-bold mb-4 text-black">Bantuan</h4>
          <ul className="space-y-3 text-gray-500 font-medium">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-900 transition-colors">
                Panduan Pengguna
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-appAccent font-semibold transition-colors">
                Login Admin &rarr;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-item border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs sm:text-sm text-gray-500 font-medium tracking-wide text-center md:text-left">
          &copy; 2026 Kelompok 4 - D4 SIB Polinema.
        </div>
        <div className="flex gap-6 text-gray-400 font-semibold font-mono justify-center md:justify-start">
          <span className="cursor-pointer hover:text-black transition-colors">IG</span>
          <span className="cursor-pointer hover:text-black transition-colors">IN</span>
          <span className="cursor-pointer hover:text-black transition-colors">GH</span>
        </div>
      </div>
    </footer>
  );
}
