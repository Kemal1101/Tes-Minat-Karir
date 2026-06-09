import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Radar } from 'react-chartjs-2';
import { X } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const riasecData = {
  R: { name: "Realistik", description: "Tipe praktis yang menyukai aktivitas fisik, bekerja dengan mesin, alat, atau berada di luar ruangan. Suka membangun sesuatu yang nyata." },
  I: { name: "Investigatif", description: "Pemikir analitis yang suka memecahkan masalah kompleks, melakukan observasi, dan mempelajari konsep-konsep abstrak atau saintifik." },
  A: { name: "Artistik", description: "Jiwa kreatif yang menyukai kebebasan berekspresi. Lebih suka lingkungan yang tidak terstruktur untuk menciptakan karya seni, musik, atau tulisan." },
  S: { name: "Sosial", description: "Pribadi yang senang membantu, mengajar, dan membimbing orang lain. Memiliki empati tinggi dan pandai berkomunikasi secara interpersonal." },
  E: { name: "Enterprising", description: "Pribadi yang ambisius dan persuasif. Suka memimpin, mengambil risiko, dan mengelola bisnis atau proyek besar untuk mencapai tujuan." },
  C: { name: "Konvensional", description: "Tipe yang terorganisir dan teliti. Menyukai keteraturan, pengolahan data, akurasi, dan bekerja dalam sistem yang terstruktur jelas." }
};

const normalizeResultJson = (resultJson) => {
  if (!resultJson || typeof resultJson !== 'object' || Array.isArray(resultJson)) {
    return {
      scores: {},
      recommendations: [],
      ranking_method: 'SAW',
    };
  }

  return {
    scores: resultJson.scores && typeof resultJson.scores === 'object' && !Array.isArray(resultJson.scores)
      ? resultJson.scores
      : resultJson.detail_persentase && typeof resultJson.detail_persentase === 'object' && !Array.isArray(resultJson.detail_persentase)
        ? resultJson.detail_persentase
        : {},
    recommendations: Array.isArray(resultJson.recommendations)
      ? resultJson.recommendations
      : Array.isArray(resultJson.rekomendasi_profesi)
        ? resultJson.rekomendasi_profesi
        : [],
    ranking_method: resultJson.ranking_method || resultJson.metode_perankingan || 'SAW',
  };
};

const getHollandCodeFromScores = (scores) => {
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
    return '';
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code]) => code)
    .join('');
};

const normalizeHistoryItem = (item) => {
  const normalizedResultJson = normalizeResultJson(item?.result_json);
  const hollandCode = item?.holland_code || getHollandCodeFromScores(normalizedResultJson.scores);

  return {
    ...item,
    holland_code: hollandCode,
    result_json: normalizedResultJson,
  };
};

const getRecommendationDetail = (career) => {
  if (typeof career === 'object' && career !== null) {
    return {
      jobName: career.Occupation || career.nama_pekerjaan || career.job_title || 'Pekerjaan tidak tersedia',
      interestCode: career['Interest Code'] || career.interest_code || '',
      score: career.Skor_SAW || career.skor || '',
      description: career.description || null
    };
  }

  return {
    jobName: String(career),
    interestCode: '',
    score: '',
    description: null
  };
};

function ResultDetailModal({ isOpen, onClose, result }) {
  const [expandedJobIndex, setExpandedJobIndex] = useState(null);

  const toggleJobDescription = (index) => {
    setExpandedJobIndex(expandedJobIndex === index ? null : index);
  };

  useEffect(() => {
    if (!isOpen) {
      setExpandedJobIndex(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const scores = result.result_json?.scores || {};
  const recommendations = result.result_json?.recommendations || [];
  const rankingMethod = result?.result_json?.ranking_method || 'SAW';
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const hollandCode = sorted.slice(0, 3).map(([code]) => code).join('');

  const radarData = {
    labels: sorted.map(([code]) => riasecData[code] ? riasecData[code].name : code),
    datasets: [
      {
        data: sorted.map(([, score]) => score),
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

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20, display: false },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
        pointLabels: {
          font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
          color: '#4B5563'
        }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar animate-slide-up touch-pan-y bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl" data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch>

        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-[#592d22] to-[#854836] p-5 sm:p-8 text-white relative min-w-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>

          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <X size={20} className="text-white" />
          </button>

          <div className="pr-12 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black mb-1">Hasil Eksplorasi Karir</h2>
            <p className="text-white/80 font-inter text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
              Selesai pada {new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-4 sm:p-8 bg-[#fcfbf9] min-w-0 overflow-x-hidden">

          {/* Top Section: Holland Code & Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 min-w-0">
            {/* Left: Holland Code */}
            <div className="flex flex-col justify-center items-center md:items-start bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
              <div className="text-sm font-inter font-bold text-gray-400 tracking-widest uppercase mb-2">Tipe Kepribadian Anda</div>
              <div className="text-4xl sm:text-6xl font-poppins font-black text-accent tracking-tight flex gap-1 mb-4 flex-wrap justify-center md:justify-start max-w-full">
                {hollandCode.split('').map((letter, i) => (
                  <span key={i} className="inline-block px-2 py-1 bg-accent/5 rounded-xl border border-accent/10">{letter}</span>
                ))}
              </div>
              <p className="text-gray-600 font-inter text-center md:text-left text-sm leading-relaxed">
                Kombinasi 3 tipe dominan ini mencerminkan preferensi utama Anda dalam berinteraksi, memecahkan masalah, dan bekerja dalam lingkungan.
              </p>
            </div>

            {/* Right: Radar Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[240px] min-w-0">
              <div className="w-full h-full max-w-[220px] sm:max-w-[250px] max-h-[220px] sm:max-h-[250px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>

          {/* Dominant Types (Top 3) */}
          <div className="mb-8">
            <h3 className="text-xl font-poppins font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="text-2xl">🌟</span> Tipe Dominan Utama
            </h3>
            <div className="space-y-4 min-w-0">
              {sorted.slice(0, 3).map(([code, score], index) => (
                <div key={code} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-accent/30 transition-colors relative overflow-hidden group min-w-0">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-saffron' : 'bg-accent/40'}`}></div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center ml-2 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center text-white font-poppins font-black text-xl sm:text-2xl flex-shrink-0 shadow-md">
                      {code}
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex justify-between items-end mb-1">
                        <h4 className="font-poppins font-bold text-text-primary text-base sm:text-lg truncate pr-2">
                          {riasecData[code]?.name || code}
                        </h4>
                        <span className="font-inter font-bold text-accent">{Math.round(score)}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-saffron' : 'bg-accent'}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>

                      <p className="text-sm font-inter text-gray-600 leading-relaxed">
                        {riasecData[code]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Types (Bottom 3) */}
          <div>
            <h3 className="text-lg font-poppins font-bold text-gray-400 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span> Dimensi Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
              {sorted.slice(3).map(([code, score]) => (
                <div key={code} className="bg-white p-4 rounded-2xl border border-gray-100 opacity-80 hover:opacity-100 transition-opacity min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 bg-gray-100 text-gray-500 rounded-md flex items-center justify-center font-bold text-xs">
                        {code}
                      </div>
                      <span className="font-poppins font-semibold text-sm text-gray-700 truncate">{riasecData[code]?.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{Math.round(score)}%</span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4 gap-3">
                <h3 className="text-xl font-poppins font-bold text-text-primary flex items-center gap-2">
                  <span className="text-2xl">💼</span> Rekomendasi Karir Tersimpan
                </h3>
                <span className="text-xs font-inter text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                  Metode {rankingMethod}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((career, index) => {
                  const detail = getRecommendationDetail(career);

                  return (
                    <div 
                      key={`${detail.jobName}-${index}`} 
                      onClick={() => toggleJobDescription(index)}
                      className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-start shadow-sm cursor-pointer hover:border-accent/30 transition-colors group"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-poppins font-bold text-white text-xs ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 'bg-gradient-to-br from-accent/80 to-accent'}`}>
                          #{index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-poppins font-bold text-text-primary mb-1 leading-snug group-hover:text-accent transition-colors">{detail.jobName}</h4>
                            <span className="text-gray-400 text-xs ml-2 mt-0.5 transition-transform duration-300" style={{ transform: expandedJobIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                          </div>
                          {(detail.interestCode || detail.score) && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {detail.interestCode && (
                                <span className="text-[11px] font-inter font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                                  Kode: {detail.interestCode}
                                </span>
                              )}
                              {detail.score && (
                                <span className="text-[11px] font-inter font-semibold bg-saffron/20 text-accent px-2 py-0.5 rounded-md">
                                  Skor: {detail.score}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Expandable description */}
                      <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${expandedJobIndex === index ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed shadow-inner">
                          {detail.description ? detail.description : "Deskripsi tidak tersedia untuk profesi ini."}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer - Sticky */}
        <div className="bg-white border-t border-gray-100 p-5 sm:p-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-poppins font-bold transition-colors w-full sm:w-auto"
          >
            Tutup Detail
          </button>
        </div>

      </div>

      {/* CSS untuk custom scrollbar khusus modal ini */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar {
          scrollbar-width: thin;
          overscroll-behavior-y: contain;
          overscroll-behavior: contain;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(133, 72, 54, 0.2);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(133, 72, 54, 0.4);
        }
      `}} />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);

  // States for dropdown and pagination
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));

      setUsername(payload.sub ? payload.sub.split(" ")[0] : "User");
    } catch (e) {
      console.error("Token invalid", e);
    }

    const fetchHistory = async () => {
      try {
        const data = await api.getUserHistory();
        const sortedHistory = (data || [])
          .map(normalizeHistoryItem)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistory(sortedHistory);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light"><div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Navbar Minimalis */}
      <nav className="bg-white border-b border-gray-100 shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div className="text-2xl font-poppins font-black cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-accent">RIASEC</span>
          </div>
          <div className="hidden md:flex gap-6 font-inter text-sm font-medium text-gray-600">
            <span className="cursor-pointer hover:text-accent border-b-2 border-accent text-accent">Beranda</span>
            <span className="cursor-pointer hover:text-accent" onClick={() => navigate("/test")}>Mulai Tes</span>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-bold cursor-pointer hover:shadow-md transition-shadow"
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {isProfileMenuOpen && (
            <div className="absolute top-14 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-2 w-48 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-sm font-poppins font-bold text-gray-800">{username}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2 text-sm font-inter text-red-500 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-poppins font-black text-text-primary">
            Halo, <span className="text-accent">{username}</span>
          </h1>
          {!hasHistory ? (
            <p className="text-gray-600 font-inter mt-4 max-w-xl text-lg">
              Selamat datang kembali di portal eksplorasi karir Anda. Temukan potensi terpendam Anda melalui metode Holland yang telah teruji secara akademis.
            </p>
          ) : (
            <p className="text-gray-600 font-inter mt-4 max-w-xl text-lg">
              Selamat datang kembali! Pantau perkembangan karir Anda di sini. Berikut adalah riwayat hasil asesmen minat bakat yang telah Anda selesaikan.
            </p>
          )}
        </div>

        {!hasHistory ? (
          /* State Kosong (Belum ada riwayat) */
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-gradient-to-br from-[#592d22] to-[#854836] rounded-3xl p-8 md:p-12 text-white shadow-lg-custom relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                <h2 className="text-3xl font-poppins font-bold mb-4">Siap Menemukan Karir Impian?</h2>
                <p className="font-inter text-white/80 mb-8 max-w-md">
                  Hanya butuh waktu sekitar 15 menit untuk memetakan kepribadian Anda ke dalam 6 dimensi Holland yang akurat.
                </p>
                <button
                  onClick={() => navigate("/test")}
                  className="bg-white text-accent font-poppins font-bold py-3 px-8 rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  Mulai Tes Sekarang →
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-poppins font-bold text-text-primary">6 Tipe Kepribadian Holland</h3>
                <span className="text-xs font-inter font-semibold tracking-wider text-gray-400 uppercase">Model RIASEC</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(riasecData).map(([code, data]) => (
                  <div key={code} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                      {code}
                    </div>
                    <h4 className="font-poppins font-bold text-text-primary mb-2">{data.name}</h4>
                    <p className="text-xs font-inter text-gray-500 leading-relaxed line-clamp-3">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* State Ada Riwayat */
          <div>
            {/* Widget Ringkasan Hasil Terakhir */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-poppins font-bold text-text-primary">Hasil Tes Terakhir</h2>
                <button
                  onClick={() => navigate("/test")}
                  className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-full font-poppins font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Mulai Tes Baru
                </button>
              </div>
              
              {(() => {
                const latestResult = history[0];
                const sortedScores = Object.entries(latestResult?.result_json?.scores || {}).sort((a, b) => b[1] - a[1]);
                const top3 = sortedScores.slice(0, 3);
                const codeString = top3.map(s => s[0]).join('');
                
                return (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="flex-shrink-0 text-center md:text-left z-10">
                      <div className="text-sm font-inter font-bold text-gray-400 tracking-widest uppercase mb-2">Tipe Dominan Anda</div>
                      <div className="text-5xl font-poppins font-black text-accent tracking-tight flex gap-1 mb-2 justify-center md:justify-start">
                        {codeString.split('').map((letter, i) => (
                          <span key={i} className="inline-block px-1.5">{letter}</span>
                        ))}
                      </div>
                      <div className="text-sm font-inter text-gray-500 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                        Diselesaikan pada {new Date(latestResult.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex-1 w-full z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {top3.map(([code, score], idx) => (
                          <div key={code} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? 'bg-saffron' : 'bg-accent/40'}`}></div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-poppins font-bold text-gray-800">{riasecData[code]?.name}</span>
                              <span className="text-sm font-bold text-accent">{Math.round(score)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${idx === 0 ? 'bg-saffron' : 'bg-accent'}`} style={{ width: `${score}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 z-10 w-full md:w-auto text-center">
                      <button
                        onClick={() => setSelectedResult(latestResult)}
                        className="w-full md:w-auto bg-white border-2 border-accent text-accent px-6 py-2.5 rounded-xl font-poppins font-bold hover:bg-accent/5 transition-colors"
                      >
                        Lihat Detail Penuh
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-poppins font-bold text-text-primary">Riwayat Asesmen</h2>
              <div className="bg-saffron/20 text-accent px-4 py-2 rounded-full font-inter text-sm font-semibold flex items-center gap-2">
                ⏱ {history.length} Sesi Tersimpan
              </div>
            </div>

            <div className="space-y-4">
              {history.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item) => {
                const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const itemScores = item.result_json?.scores || {};
                // Get top 2 scores
                const sortedScores = Object.entries(itemScores).sort((a, b) => b[1] - a[1]);
                const top1 = sortedScores[0];
                const top2 = sortedScores[1];

                return (
                  <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        📄
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-inter text-gray-500">{date}</span>
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full tracking-wider">SELESAI</span>
                        </div>
                        <h3 className="font-poppins font-bold text-lg text-text-primary">
                          Tipe Dominan: <span className="text-accent">{riasecData[item.holland_code?.[0]]?.name || item.holland_code || 'Tidak tersedia'}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Skor Tertinggi</div>
                        {top1 ? (
                          <div className="flex gap-3 font-poppins font-semibold text-sm">
                            <span className="bg-gray-50 px-2 py-1 rounded">{top1[0]}: {Math.round(top1[1])}</span>
                            {top2 && <span className="bg-gray-50 px-2 py-1 rounded">{top2[0]}: {Math.round(top2[1])}</span>}
                          </div>
                        ) : (
                          <span className="text-xs font-inter text-gray-400">Data skor tidak tersedia</span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedResult(item)}
                        className="bg-gradient-to-r from-accent to-accent-dark text-white px-6 py-2.5 rounded-xl font-inter font-semibold text-sm hover:shadow-md transition-all whitespace-nowrap"
                      >
                        Lihat Detail →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {history.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-inter font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Sebelumnya
                </button>
                <span className="text-sm font-inter font-medium text-gray-600">
                  Halaman {currentPage} dari {Math.ceil(history.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(history.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={currentPage === Math.ceil(history.length / ITEMS_PER_PAGE)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-inter font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            )}

            <div className="mt-16">
              <h2 className="text-2xl font-poppins font-bold text-text-primary mb-6">Pusat Edukasi RIASEC</h2>
              <div className="space-y-4">
                {Object.entries(riasecData).map(([code, data]) => (
                  <details key={code} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 font-poppins font-semibold text-text-primary cursor-pointer hover:bg-gray-50 rounded-2xl outline-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">{code}</div>
                        <span className="text-lg">{data.name}</span>
                      </div>
                      <span className="transition duration-300 group-open:rotate-180 text-gray-400">
                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="p-5 pt-0 text-gray-600 font-inter leading-relaxed">
                      {data.description}
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      <ResultDetailModal
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
    </div>
  );
}
