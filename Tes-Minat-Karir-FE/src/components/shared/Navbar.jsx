import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Navbar() {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".nav-bar", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // Jika tidak berada di halaman utama, navigasi ke beranda lalu scroll (dikelola oleh rute)
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100); // Waktu jeda agar halaman ter-render
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
    <nav className="nav-bar fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-50 bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-full flex justify-between items-center px-4 md:px-8 py-2.5 md:py-4 transition-all duration-300">
      <Link to="/" className="font-extrabold text-lg md:text-2xl tracking-tight text-black hover:opacity-80 transition-opacity ml-1">
        RIASEC.
      </Link>
      <div className="flex items-center gap-4 md:gap-8 font-semibold text-[11px] md:text-sm text-gray-800">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="hover:text-appAccent transition-colors hidden sm:block"
        >
          Beranda
        </a>
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, "#about")}
          className="hover:text-appAccent transition-colors"
        >
          Tentang Tes
        </a>
        <a
          href="#how-it-works"
          onClick={(e) => handleNavClick(e, "#how-it-works")}
          className="hover:text-appAccent transition-colors hidden sm:block"
        >
          Cara Kerja
        </a>
        {/* Profile Placeholder */}
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ml-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </nav>
  );
}
