import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Radar } from "react-chartjs-2";
import AuthModal from "../../components/shared/AuthModal";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const riasecData = {
  R: { name: "Realistik", description: "Tipe praktis yang menyukai aktivitas fisik, bekerja dengan mesin, alat, atau di luar ruangan. Suka membangun sesuatu yang nyata." },
  I: { name: "Investigatif", description: "Pemikir analitis yang suka memecahkan masalah kompleks, observasi, dan mempelajari konsep abstrak atau saintifik." },
  A: { name: "Artistik", description: "Jiwa kreatif yang menyukai kebebasan berekspresi. Suka lingkungan yang tidak terstruktur untuk seni, musik, atau tulisan." },
  S: { name: "Sosial", description: "Pribadi yang senang membantu, mengajar, dan membimbing orang lain. Punya empati tinggi dan komunikator yang baik." },
  E: { name: "Enterprising", description: "Pribadi yang ambisius dan persuasif. Suka memimpin, mengambil risiko, dan mengelola bisnis/proyek." },
  C: { name: "Konvensional", description: "Tipe yang terorganisir dan teliti. Menyukai keteraturan, pengolahan data, akurasi, dan sistem terstruktur." }
};

const buildHistoryResultJson = (result) => ({
  scores: result?.detail_persentase || result?.scores || {},
  recommendations: result?.rekomendasi_profesi || result?.recommendations || [],
  ranking_method: result?.metode_perankingan || result?.ranking_method || "SAW",
});

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const hasSavedRef = useRef(false);
  const apiResult = location.state?.apiResult;

  if (!apiResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg-custom text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm">
            ⚠️
          </div>
          <h2 className="text-2xl font-sans font-bold text-appAccent mb-4">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 font-sans mb-8">Sesi tes Anda mungkin telah berakhir atau belum dimulai. Silakan isi tes terlebih dahulu.</p>
          <button
            onClick={() => navigate('/test')}
            className="w-full py-4 bg-appAccent text-white rounded-xl font-sans font-bold hover:bg-[#6d392c] hover:shadow-lg transition-all"
          >
            Mulai Tes Sekarang
          </button>
        </div>
      </div>
    );
  }
  const scores = apiResult.detail_persentase || apiResult.scores || {};
  
  // Gunakan useMemo agar kalkulasi dan data grafik tidak dirender ulang secara paksa setiap kali "Lihat Semua" diklik (mengatasi lag)
  const sorted = useMemo(() => Object.entries(scores).sort((a, b) => b[1] - a[1]), [scores]);
  const hollandCode = useMemo(() => sorted.slice(0, 3).map(([code]) => code).join(''), [sorted]);
  
  const recommendations = apiResult.rekomendasi_profesi || apiResult.recommendations || [];
  const visibleCareers = showAllCareers ? recommendations : recommendations.slice(0, 5);
  const rankingMethod = apiResult.metode_perankingan || apiResult.ranking_method || "SAW";

  const saveResultToBackend = async () => {
    if (!apiResult || hasSavedRef.current) return;
    try {
      const key = 'last_saved_result';
      const hollandCodeToSave = apiResult.kode_holland || apiResult.holland_code || hollandCode;
      const resultJsonToSave = buildHistoryResultJson(apiResult);
      const payloadStr = JSON.stringify({ hollandCodeToSave, result_json: resultJsonToSave });
      const prev = sessionStorage.getItem(key);
      if (prev === payloadStr) {
        hasSavedRef.current = true;
        return; // already saved
      }

      if (!hollandCodeToSave) return;

      hasSavedRef.current = true;
      setIsSaving(true);
      await api.saveTestResult({
        holland_code: hollandCodeToSave,
        result_json: resultJsonToSave,
      });
      sessionStorage.setItem(key, payloadStr);
    } catch (err) {
      console.error('Gagal menyimpan hasil tes:', err);
      hasSavedRef.current = false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Only auto-save if user is logged in
    if (localStorage.getItem("token")) {
      saveResultToBackend();
    }
  }, [apiResult, hollandCode]);

  const handleSaveTest = () => {
    if (!localStorage.getItem("token")) {
      setIsAuthModalOpen(true);
    } else {
      saveResultToBackend();
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    await saveResultToBackend();
  };

  const radarData = useMemo(() => {
    const riasecOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
    return {
      labels: riasecOrder.map((code) => riasecData[code]?.name || code),
      datasets: [
        {
          data: riasecOrder.map((code) => Math.max(0, scores[code] || 0)),
          backgroundColor: 'rgba(133,72,54,0.25)',
          borderColor: '#854836',
          borderWidth: 2.5,
          pointBackgroundColor: '#F5B553',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#854836',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [scores]);

  const radarOptions = useMemo(() => ({
    scales: {
      r: { 
        min: 0, 
        max: 100, 
        ticks: { stepSize: 20, display: false },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
        pointLabels: {
          font: { family: "'Host Grotesk', sans-serif", size: 12, weight: '600' },
          color: '#4B5563'
        }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  }), []);

  return (
    <div className="min-h-screen bg-bg-light font-sans text-text-primary selection:bg-appAccent/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#592d22] to-[#854836] p-8 md:p-12 text-white relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Hasil Eksplorasi Karir</h1>
            <p className="text-white/80 font-medium text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              Tes diselesaikan pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-lg font-medium transition-all hover:scale-105 shadow-sm"
            >
              Ke Landing Page
            </button>
            {localStorage.getItem("token") && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-lg font-medium transition-all hover:scale-105 shadow-sm"
              >
                Ke Dashboard
              </button>
            )}
            <button 
              onClick={() => navigate('/test')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold transition-all hover:scale-105 shadow-sm"
            >
              Ulangi Tes
            </button>
            {!localStorage.getItem("token") && !hasSavedRef.current && (
              <button 
                onClick={handleSaveTest}
                className="px-6 py-3 bg-white text-appAccent rounded-xl font-bold transition-all hover:scale-105 shadow-sm"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Tes'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 -mt-8 relative z-20">
        
        {/* Top Section: Holland Code & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Holland Code */}
          <div className="flex flex-col justify-center items-center lg:items-start bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/60 shadow-md-custom">
            <div className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">Tipe Kepribadian Anda</div>
            <div className="text-6xl md:text-7xl font-black text-appAccent tracking-tight flex gap-2 mb-6 flex-wrap justify-center lg:justify-start">
              {hollandCode.split('').map((letter, i) => (
                <span key={i} className="inline-block px-4 py-2 bg-appAccent/5 rounded-2xl border border-appAccent/10 shadow-sm">{letter}</span>
              ))}
            </div>
            <p className="text-gray-600 text-center lg:text-left text-base leading-relaxed">
              Kombinasi 3 tipe dominan ini mencerminkan preferensi utama Anda dalam berinteraksi, memecahkan masalah, dan bekerja dalam suatu lingkungan.
            </p>
          </div>
          
          {/* Right: Radar Chart */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-md-custom flex items-center justify-center min-h-[300px]">
            <div className="w-full h-full max-w-[280px] max-h-[280px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>
        
        {/* Dominant Types (Top 3) */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-text-primary mb-5 flex items-center gap-3">
            <span className="text-3xl drop-shadow-sm">🌟</span> Tipe Dominan Utama
          </h3>
          <div className="space-y-4">
            {sorted.slice(0, 3).map(([code, score], index) => (
              <div key={code} className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-md hover:border-appAccent/30 transition-all group">
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-appAccent to-[#6d392c] rounded-2xl flex items-center justify-center text-white font-black text-3xl flex-shrink-0 shadow-md">
                    {code}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="font-bold text-text-primary text-xl">
                        {riasecData[code]?.name || code}
                      </h4>
                      <span className="font-bold text-appAccent text-lg">{Math.round(score)}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden shadow-inner flex">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-[#854836]"
                        style={{ width: `${Math.max(0, parseFloat(score))}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
                      {riasecData[code]?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Types (Bottom 3) */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-400 mb-5 flex items-center gap-2">
            <span className="text-2xl opacity-70">📊</span> Dimensi Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sorted.slice(3).map(([code, score]) => (
              <div key={code} className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center font-bold text-sm">
                      {code}
                    </div>
                    <span className="font-semibold text-base text-gray-700">{riasecData[code]?.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">{Math.round(score)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(0, parseFloat(score))}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-md-custom p-6 md:p-10 border border-white/60 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-3xl drop-shadow-sm">💼</span> Rekomendasi Profesi
              </h3>
              <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl font-medium">
                Metode {rankingMethod}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCareers.map((career, index) => {
                const jobName = typeof career === 'object'
                  ? (career.Occupation || career.nama_pekerjaan || career.job_title || 'Profesi')
                  : career;
                const score = typeof career === 'object' ? (career.Skor_SAW || career.skor) : null;
                const code = typeof career === 'object' ? (career['Interest Code'] || career.interest_code) : null;

                return (
                  <div 
                    key={index} 
                    className="bg-white hover:bg-bg-light p-5 rounded-2xl border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md hover:border-appAccent/30 group animate-fade-in"
                    style={{ animationDelay: `${(index % 5) * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-white text-sm shadow-sm ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 'bg-gradient-to-br from-appAccent/80 to-appAccent'}`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-text-primary mb-1.5 leading-snug group-hover:text-appAccent transition-colors">{jobName}</h4>
                      {(code || score) && (
                        <div className="flex flex-wrap gap-2">
                          {code && (
                            <span className="text-xs font-semibold bg-appAccent/10 text-appAccent px-2.5 py-1 rounded-lg">
                              Kode: {code}
                            </span>
                          )}
                          {score && (
                            <span className="text-xs font-semibold bg-saffron/20 text-appAccent px-2.5 py-1 rounded-lg">
                              Skor: {score}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {recommendations.length > 5 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllCareers(!showAllCareers)}
                  className="px-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all border border-gray-200 active:scale-95 hover:shadow-sm"
                >
                  {showAllCareers ? 'Sembunyikan Sebagian' : `Lihat Semua (${recommendations.length} Pekerjaan)`}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
