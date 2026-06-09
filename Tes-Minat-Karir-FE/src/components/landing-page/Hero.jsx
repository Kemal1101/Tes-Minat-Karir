import { useRef } from "react";
import { Link } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import gsap from "gsap";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function Hero() {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle (gentle 10 degrees max)
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardRef.current, {
      duration: 0.4,
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      duration: 0.8,
      rotationX: 0,
      rotationY: 0,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const radarData = {
    labels: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
    datasets: [
      {
        data: [85, 60, 45, 90, 75, 50],
        backgroundColor: "rgba(133,72,54,0.25)",
        borderColor: "#854836",
        borderWidth: 2.5,
        pointBackgroundColor: "#F5B553",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#854836",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20, display: false },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        angleLines: { color: "rgba(0, 0, 0, 0.05)" },
        pointLabels: {
          font: { family: "'Host Grotesk', sans-serif", size: 10, weight: "600" },
          color: "#4B5563",
        },
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 md:px-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 md:gap-4 bg-white border border-gray-200 shadow-sm rounded-full p-1 md:p-1.5 pr-4 md:pr-6 cursor-pointer hover:-translate-y-1 transition-transform duration-300 mb-8 md:mb-12">
            <span className="bg-appAccent text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-mono shadow-sm">
              NEW
            </span>
            <span className="text-[11px] sm:text-sm text-gray-800 font-semibold tracking-tight">
              Sistem Terintegrasi Metode SAW & CF
            </span>
          </div>

          <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl font-semibold tracking-tight md:leading-[1.05] text-black w-full mb-6 whitespace-pre-line">
            Temukan Potensi Minat Karir Terbaik Anda Secara Akurat
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 font-medium max-w-2xl mb-10 md:mb-12 leading-relaxed">
            Eksplorasi Karir. Dirancang untuk Masa Depan. Kenali minat sejatimu dan bangun karir impianmu. Cepat, akurat, dan menghubungkan Anda dengan profesi global.
          </p>

          <div className="cta-group flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
            <Link to="/test" className="w-full sm:w-auto bg-appAccent text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold transition-opacity duration-300 hover:opacity-90 shadow-sm">
              Mulai Tes Sekarang
            </Link>
          </div>
        </div>

        {/* Mockup Visual - Interactive Card */}
        <div className="lg:col-span-1 flex justify-center perspective-[1500px]">
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col items-center z-20 transform-style-3d cursor-default"
            style={{ willChange: "transform" }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-black text-center">
              Simulasi Hasil Profiling
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 text-center font-medium">
              Analisis RIASEC interaktif untuk Anda.
            </p>
            <div className="w-full h-full min-h-[260px] max-w-[260px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-appAccent/10 text-appAccent rounded-lg text-xs font-bold border border-appAccent/20">Social: 90%</span>
              <span className="px-3 py-1 bg-saffron/20 text-appAccent rounded-lg text-xs font-bold border border-saffron/30">Realistic: 85%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
