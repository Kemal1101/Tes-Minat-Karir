import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
const riasecData = {
  R: { name: "Realistic",     description: "Tipe praktis, suka bekerja dengan mesin, alat, atau aktivitas luar ruangan." },
  I: { name: "Investigative", description: "Tipe analitis, suka memecahkan masalah, meneliti, dan ilmu pengetahuan." },
  A: { name: "Artistic",      description: "Tipe kreatif, imajinatif, dan suka mengekspresikan diri melalui seni dan desain." },
  S: { name: "Social",        description: "Tipe sosial, suka membantu, mengajar, dan berinteraksi dengan orang lain." },
  E: { name: "Enterprising",  description: "Tipe ambisius, suka memimpin, berbisnis, dan memengaruhi orang lain." },
  C: { name: "Conventional",  description: "Tipe teratur, teliti, dan suka bekerja dengan data, angka, atau prosedur yang jelas." }
};
import { api } from '../../lib/api';
import './App.css';
import { useToast } from '../../hooks/useToast';
import AuthModal from '../../components/shared/AuthModal';

const options = [
  { v: 1, l: 'Sangat Tidak Suka' },
  { v: 2, l: 'Tidak Suka' },
  { v: 3, l: 'Netral' },
  { v: 4, l: 'Suka' },
  { v: 5, l: 'Sangat Suka' },
];

const getOptionColor = (value, selected) => {
  if (selected !== value) return null;
  if (value === 5 || value === 4) return 'from-green-500 to-emerald-500';
  if (value === 3) return 'from-yellow-500 to-amber-500';
  return 'from-red-500 to-orange-500';
};

function Navbar() {
  return (
    <nav className="bg-white border-b-4 border-accent shadow-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <div className="text-3xl font-poppins font-black">
          <span className="text-accent">RIASEC</span>
          <span className="text-saffron ml-2">Career</span>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const navigate = useNavigate();
  const { data: apiQuestions = [], isLoading: isFetchingQuestions } = useQuery({
    queryKey: ['publicQuestions'],
    queryFn: async () => {
      const res = await api.getPublicQuestions();
      return res.data || res;
    }
  });

  const [apiResult, setApiResult] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (apiQuestions.length > 0 && answers.length === 0) {
      setAnswers(Array(apiQuestions.length).fill(null));
    }
  }, [apiQuestions]);

  const transition = (callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
    setShowValidation(false);

    setTimeout(() => {
      if (currentIndex < apiQuestions.length - 1) {
        transition(() => setCurrentIndex((i) => i + 1));
      }
    }, 600);
  };

  const handleNext = () => {
    if (!answers[currentIndex]) { setShowValidation(true); return; }
    if (currentIndex < apiQuestions.length - 1) {
      transition(() => setCurrentIndex((i) => i + 1));
    }
  };

  const handlePrevious = () => {
    transition(() => setCurrentIndex((i) => i - 1));
  };

  const handleFinish = async () => {
    if (!answers[currentIndex]) {
      setShowValidation(true);
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.calculateResult({
        nama: 'Anonim',
        jawaban: answers,
        target_job_zone: targetJobZone,
      });

      navigate('/result', {
        state: {
          apiResult: data,
        },
      });

    } catch (err) {
      console.error('Error calculating result:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const detailPersentase = apiResult?.detail_persentase || {};
    const rekomendasiProfesi = Array.isArray(apiResult?.rekomendasi_profesi)
      ? apiResult.rekomendasi_profesi
      : [];

    setIsSaving(true);
    try {
      await api.saveTestResult({
        holland_code: apiResult.kode_holland,
        result_json: {
          scores: detailPersentase,
          recommendations: rekomendasiProfesi,
          ranking_method: apiResult?.metode_perankingan || 'SAW'
        }
      });
      toast("Hasil tes berhasil disimpan ke riwayat!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (error) {
      console.error("Error saving result:", error);
      toast("Gagal menyimpan hasil tes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    handleSaveResult();
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        {/* Navbar */}
        <nav className="bg-white border-b-4 border-accent shadow-soft">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <div className="text-3xl font-poppins font-black">
              <span className="text-accent">RIASEC</span>
              <span className="text-saffron ml-2">Career</span>
            </div>
          </div>
        </nav>

        {/* Loading Container */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="relative w-24 h-24 mb-8">
            {/* Animated loading blob */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-saffron rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-bg-light rounded-full"></div>
            <div className="absolute inset-0 rounded-full animate-spin" style={{
              background: 'conic-gradient(from 0deg, #854836, #F5B553, #854836)',
              opacity: 0.7
            }}></div>
          </div>
          
          <h2 className="text-2xl font-poppins font-bold text-accent text-center">
            Menganalisis hasil...
          </h2>
          <p className="text-gray-500 mt-2 font-inter">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  /* ================= RESULT ================= */
  if (isFinished && apiResult) {
    const scores = apiResult.detail_persentase;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topCode = sorted[0][0];

    const radarData = {
      labels: sorted.map(([code]) => riasecData[code] ? riasecData[code].name : code),
      datasets: [
        {
          data: sorted.map(([, score]) => score),
          backgroundColor: 'rgba(133,72,54,0.2)',
          borderColor: '#854836',
          borderWidth: 2,
          pointBackgroundColor: '#F5B553'
        }
      ]
    };

    const radarOptions = {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        {/* Navbar */}
        <nav className="bg-white border-b-4 border-accent shadow-soft">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <div className="text-3xl font-poppins font-black">
              <span className="text-accent">RIASEC</span>
              <span className="text-saffron ml-2">Career</span>
            </div>
          </div>
        </nav>

        {/* Result Container */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-poppins font-black text-accent mb-2">
                Hasil Test Anda
              </h1>
              <p className="text-lg text-gray-600 font-inter">
                Profil minat karir berdasarkan RIASEC
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Chart Section */}
              <div className="bg-white rounded-3xl shadow-md-custom p-8 animate-slide-up">
                <h2 className="text-2xl font-poppins font-bold text-accent mb-6">
                  Profil Kamu
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                
                {/* Legend */}
                <div className="mt-6 space-y-3">
                  {sorted.map(([code, score]) => (
                    <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#854836' }}></div>
                        <span className="font-inter font-medium text-text-primary">
                          {riasecData[code] ? riasecData[code].name : code}
                        </span>
                      </div>
                      <span className="font-poppins font-bold text-accent">{Math.round(score)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {sorted.slice(0, 3).map(([code, score]) => (
                  <div
                    key={code}
                    className="bg-white rounded-3xl shadow-md-custom p-6 border-l-4 border-accent hover:shadow-lg-custom transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center">
                        <span className="text-xl font-poppins font-black text-white">{code}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-poppins font-bold text-accent mb-1">
                          {riasecData[code] ? riasecData[code].name : code}
                          <span className="text-saffron ml-2">({Math.round(score)}%)</span>
                        </h3>
                        <p className="text-gray-600 font-inter text-sm leading-relaxed">
                          {riasecData[code] ? riasecData[code].description : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Career Recommendations */}
                <div className="bg-white rounded-3xl shadow-md-custom p-6 border-t-4 border-saffron">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-poppins font-bold text-accent">
                      💼 Rekomendasi Karir
                    </h3>
                    <span className="text-sm font-inter text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Berdasarkan {apiResult.metode_perankingan || 'SAW'}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {apiResult.rekomendasi_profesi && (showAllCareers ? apiResult.rekomendasi_profesi : apiResult.rekomendasi_profesi.slice(0, 3)).map((career, index) => {
                      const jobName = typeof career === 'object' ? career.Occupation || career.nama_pekerjaan || career.job_title : career;
                      const score = typeof career === 'object' ? (career.Skor_SAW || career.skor || '') : '';
                      const code = typeof career === 'object' ? (career['Interest Code'] || '') : '';
                      
                      return (
                        <div key={index} className="flex items-center p-4 bg-gradient-to-r from-bg-light to-white rounded-2xl border border-gray-100 hover:border-saffron hover:shadow-md transition-all group">
                          <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-poppins font-bold text-white mr-4 ${index === 0 ? 'bg-yellow-400 shadow-lg' : index === 1 ? 'bg-gray-300 shadow-md' : index === 2 ? 'bg-amber-600 shadow-md' : 'bg-accent'}`}>
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-poppins font-bold text-text-primary text-lg group-hover:text-accent transition-colors">
                              {jobName}
                            </h4>
                            {typeof career === 'object' && (code || score) && (
                              <div className="flex gap-2 mt-1">
                                {code && (
                                  <span className="text-xs font-inter font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                                    Kode: {code}
                                  </span>
                                )}
                                {score && (
                                  <span className="text-xs font-inter font-semibold bg-saffron/20 text-accent px-2 py-0.5 rounded-md">
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
                  
                  {apiResult.rekomendasi_profesi && apiResult.rekomendasi_profesi.length > 3 && (
                    <button
                      onClick={() => setShowAllCareers(!showAllCareers)}
                      className="mt-6 w-full py-3 bg-gray-50 hover:bg-gray-100 text-accent font-poppins font-semibold rounded-xl transition-colors border border-gray-200"
                    >
                      {showAllCareers ? 'Sembunyikan' : `Lihat Semua Pekerjaan (${apiResult.rekomendasi_profesi.length})`}
                    </button>
                  )}
                </div>

                {/* Save and Restart Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleSaveResult}
                    disabled={isSaving}
                    className="w-full py-3 px-6 bg-white text-accent border-2 border-accent rounded-xl font-poppins font-bold hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? "Menyimpan..." : "💾 Simpan Hasil ke Riwayat"}
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full py-3 px-6 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-poppins font-bold hover:shadow-lg-custom transition-all"
                  >
                    Ulangi Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      </div>
    );
  }

  /* ================= TEST ================= */
  if (isFetchingQuestions) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-poppins font-bold text-accent text-center">Memuat pertanyaan...</h2>
        </div>
      </div>
    );
  }

  if (apiQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <h2 className="text-xl font-poppins text-red-500">Gagal memuat pertanyaan.</h2>
        </div>
      </div>
    );
  }

  /* ── LOADING: calculating result ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-saffron rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-bg-light rounded-full" />
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{ background: 'conic-gradient(from 0deg, #854836, #F5B553, #854836)', opacity: 0.7 }}
            />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-accent text-center">Menganalisis hasil...</h2>
          <p className="text-gray-500 mt-2 font-inter">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  /* ── WELCOME ── */
  if (!isStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg-custom p-8 md:p-10 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-accent mb-6 text-center">
              Selamat Datang di Tes Minat Karir
            </h2>
            <p className="text-gray-600 font-inter text-center mb-8">
              Sebelum memulai, beritahu kami sedikit tentang rencana pendidikan Anda untuk rekomendasi karir yang lebih akurat.
            </p>

            <div className="mb-8">
              <label className="block text-lg font-poppins font-semibold text-text-primary mb-4">
                Apa level pendidikan terakhir atau target pendidikan masa depan Anda?
              </label>
              <div className="space-y-3">
                {[
                  { v: 1, l: 'Lulusan SMA/SMK' },
                  { v: 3, l: 'D3 / Vokasi' },
                  { v: 4, l: 'S1 / Sarjana' },
                  { v: 5, l: 'S2 / Spesialis / Dokter' },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setTargetJobZone(opt.v)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      targetJobZone === opt.v
                        ? 'border-accent bg-accent/5 shadow-md'
                        : 'border-gray-200 hover:border-accent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        targetJobZone === opt.v ? 'border-accent' : 'border-gray-400'
                      }`}>
                        {targetJobZone === opt.v && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                      </div>
                      <span className="font-inter font-medium text-text-primary">{opt.l}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsStarted(true)}
              disabled={!targetJobZone}
              className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-poppins font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102"
            >
              Mulai Tes Sekarang →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── TEST ── */
  const q = apiQuestions[currentIndex];
  const progress = ((currentIndex + (answers[currentIndex] !== null ? 1 : 0)) / apiQuestions.length) * 100;
  const isLast = currentIndex === apiQuestions.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8 animate-fade-in">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#854836] to-[#F5B553] rounded-full shadow-md"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-poppins font-bold text-accent">
                Pertanyaan {currentIndex + 1} dari {apiQuestions.length}
              </span>
              <span className="text-xs font-inter text-gray-500">
                {Math.round(progress)}% Selesai
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div
            className={`bg-white rounded-3xl shadow-lg-custom p-8 md:p-10 mb-8 transition-all duration-300 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-slide-up'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-accent leading-relaxed mb-8">
              {q.text}
            </h2>

            {showValidation && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
                <p className="text-red-700 font-inter font-medium text-sm">
                  ⚠️ Silakan pilih salah satu opsi jawaban sebelum melanjutkan
                </p>
              </div>
            )}

            <div className="space-y-3">
              {options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.v;
                const bgColor = getOptionColor(opt.v, answers[currentIndex]);

                return (
                  <button
                    key={opt.v}
                    onClick={() => handleSelect(opt.v)}
                    className={`w-full group relative overflow-hidden rounded-2xl p-4 md:p-5 text-left transition-all duration-300 transform border-2 ${
                      isSelected
                        ? `bg-gradient-to-r ${bgColor} text-white border-transparent shadow-lg scale-105`
                        : 'bg-white text-text-primary border-gray-200 hover:border-accent hover:shadow-md hover:scale-102 hover:bg-gradient-to-r hover:from-accent/5 hover:to-saffron/5'
                    }`}
                  >
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-saffron/0 group-hover:from-accent/5 group-hover:to-saffron/5 transition-all duration-300" />
                    )}
                    <div className="relative flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected ? 'bg-white border-white' : 'border-gray-400 group-hover:border-accent'
                        }`}
                      >
                        {isSelected && <div className="w-3 h-3 bg-accent rounded-full animate-pulse-ring" />}
                      </div>
                      <span className="font-inter font-semibold text-base md:text-lg">{opt.l}</span>
                      {isSelected && <span className="ml-auto text-xl">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-gray-500 text-sm font-inter mt-6">
              Pilih jawaban yang paling sesuai dengan perasaan Anda →
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 animate-fade-in">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 py-3 px-6 bg-white text-accent border-2 border-accent rounded-xl font-poppins font-bold hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={isLast ? handleFinish : handleNext}
              disabled={!answers[currentIndex]}
              className={`flex-1 py-3 px-6 rounded-xl font-poppins font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                isLast
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
                  : 'bg-gradient-to-r from-accent to-accent-dark hover:shadow-lg'
              }`}
            >
              {isLast ? '🎉 Lihat Hasil' : 'Selanjutnya →'}
            </button>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm font-inter">
            💡 Jawaban Anda akan secara otomatis menyimpan dan pindah ke pertanyaan berikutnya
          </div>
        </div>
      </div>
    </div>
  );
}