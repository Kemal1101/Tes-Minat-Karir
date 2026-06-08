import { Link } from "react-router-dom";
import { Radar } from "react-chartjs-2";
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
    <section id="hero" className="relative flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32">
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 md:gap-4 bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm rounded-full p-1 md:p-1.5 pr-4 md:pr-6 cursor-pointer hover:bg-white/60 hover:-translate-y-1 transition-all duration-300 mb-8 md:mb-12">
            <span className="bg-appAccent text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-mono shadow-sm">
              NEW
            </span>
            <span className="text-[11px] sm:text-sm text-gray-800 font-semibold tracking-tight">
              Sistem Terintegrasi Metode SAW & CF
            </span>
          </div>

          <h1 className="hero-title text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl font-semibold tracking-tight md:leading-[1.05] text-black w-full mb-6 whitespace-pre-line">
            Temukan Potensi Minat Karir Terbaik Anda Secara Akurat
          </h1>

          <p className="hero-desc text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 font-medium max-w-2xl mb-10 md:mb-12 leading-relaxed">
            Eksplorasi Karir. Dirancang untuk Masa Depan. Kenali minat sejatimu dan bangun karir impianmu. Cepat, akurat, dan menghubungkan Anda dengan profesi global.
          </p>

          <div className="cta-group flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
            <Link to="/test" className="w-full sm:w-auto bg-appAccent text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold transition-opacity duration-300 hover:opacity-90 shadow-sm">
              Mulai Tes Sekarang
            </Link>
          </div>
        </div>

        {/* Mockup Visual */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center w-full max-w-sm">
            <h3 className="text-xl font-bold text-black mb-2">Simulasi Hasil Profiling</h3>
            <p className="text-sm text-gray-800 mb-6 font-medium text-center">Analisis RIASEC interaktif untuk Anda.</p>
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
