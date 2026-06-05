import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";


const riasecData = {
  R: { name: "Realistic",     description: "Tipe praktis, suka bekerja dengan mesin, alat, atau aktivitas luar ruangan." },
  I: { name: "Investigative", description: "Tipe analitis, suka memecahkan masalah, meneliti, dan ilmu pengetahuan." },
  A: { name: "Artistic",      description: "Tipe kreatif, imajinatif, dan suka mengekspresikan diri melalui seni dan desain." },
  S: { name: "Social",        description: "Tipe sosial, suka membantu, mengajar, dan berinteraksi dengan orang lain." },
  E: { name: "Enterprising",  description: "Tipe ambisius, suka memimpin, berbisnis, dan memengaruhi orang lain." },
  C: { name: "Conventional",  description: "Tipe teratur, teliti, dan suka bekerja dengan data, angka, atau prosedur yang jelas." }
};

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

// Navbar dihapus karena pengguna tidak menginginkannya di halaman Tes

export default function Test({ onFinish }) {
  const navigate = useNavigate();
  const { data: apiQuestions = [], isLoading: isFetchingQuestions } = useQuery({
    queryKey: ['publicQuestions'],
    queryFn: async () => {
      const res = await api.getPublicQuestions();
      return res.data || res;
    }
  });

  const [isStarted, setIsStarted] = useState(() => {
    return sessionStorage.getItem('test_started') === 'true';
  });
  const [targetJobZone, setTargetJobZone] = useState(() => {
    const saved = sessionStorage.getItem('test_jobZone');
    return saved ? parseInt(saved, 10) : null;
  });
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = sessionStorage.getItem('test_currentIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = sessionStorage.getItem('test_answers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (apiQuestions.length > 0 && answers.length === 0) {
      setAnswers(Array(apiQuestions.length).fill(null));
    }
  }, [apiQuestions]);

  // Simpan progress ke sessionStorage setiap kali ada perubahan
  useEffect(() => {
    sessionStorage.setItem('test_started', isStarted);
    if (targetJobZone) sessionStorage.setItem('test_jobZone', targetJobZone);
    sessionStorage.setItem('test_currentIndex', currentIndex);
    sessionStorage.setItem('test_answers', JSON.stringify(answers));
  }, [isStarted, targetJobZone, currentIndex, answers]);

  const transition = (callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };

  const handleSelect = (val) => {
    if (isLocked) return;
    setIsLocked(true);

    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
    setShowValidation(false);

    // Jeda untuk memberi kesempatan pengguna melihat jawaban yang dipilih, 
    // sebelum lanjut ke soal berikutnya secara otomatis (anti-spam)
    setTimeout(() => {
      if (currentIndex < apiQuestions.length - 1) {
        transition(() => {
          setCurrentIndex((i) => i + 1);
          setIsLocked(false);
        });
      } else {
        setIsLocked(false);
      }
    }, 800);
  };

  const handleNext = () => {
    if (!answers[currentIndex]) { setShowValidation(true); return; }
    if (currentIndex < apiQuestions.length - 1) {
      setIsLocked(true);
      transition(() => {
        setCurrentIndex((i) => i + 1);
        setIsLocked(false);
      });
    }
  };

  const handlePrevious = () => {
    setIsLocked(true);
    transition(() => {
      setCurrentIndex((i) => i - 1);
      setIsLocked(false);
    });
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

      // Hapus session storage jika tes berhasil disubmit
      sessionStorage.removeItem('test_started');
      sessionStorage.removeItem('test_jobZone');
      sessionStorage.removeItem('test_currentIndex');
      sessionStorage.removeItem('test_answers');

      // Tambahkan delay buatan agar terlihat sistem sedang "berpikir" mencocokkan data
      setTimeout(() => {
        navigate('/result', {
          state: {
            apiResult: data,
          },
        });
      }, 2500); // 2.5 detik

    } catch (err) {
      console.error('Error calculating result:', err);
      setIsLoading(false);
    }
  };
  /* ── LOADING: fetching questions ── */
  if (isFetchingQuestions) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-12 h-12 border-4 border-appAccent border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-poppins font-bold text-appAccent text-center">Memuat Pertanyaan..</h2>
        </div>
      </div>
    );
  }

  if (apiQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <div className="flex-1 flex items-center justify-center px-4">
          <h2 className="text-xl font-poppins text-red-500">Gagal memuat pertanyaan.</h2>
        </div>
      </div>
    );
  }

  /* ── LOADING: calculating result ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light justify-center items-center px-4">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-lg-custom flex flex-col items-center max-w-sm w-full animate-fade-in border border-white/60">
          <div className="relative mb-8 flex items-center justify-center">
            {/* Inner pulsing sparkle (tanpa background lingkaran) */}
            <div className="animate-pulse flex items-center justify-center drop-shadow-lg">
              <span className="text-5xl">✨</span>
            </div>
          </div>
          <h2 className="text-2xl font-sans font-black text-appAccent text-center mb-2 animate-pulse">
            Menganalisis Profil...
          </h2>
          <p className="text-gray-500 font-sans text-center text-sm">
            Mencocokkan kepribadian Anda dengan ratusan profesi terbaik.
          </p>
        </div>
      </div>
    );
  }

  /* ── WELCOME ── */
  if (!isStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg-custom p-8 md:p-10 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-appAccent mb-6 text-center">
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
                        ? 'border-appAccent bg-appAccent/5 shadow-md'
                        : 'border-gray-200 hover:border-appAccent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        targetJobZone === opt.v ? 'border-appAccent' : 'border-gray-400'
                      }`}>
                        {targetJobZone === opt.v && <div className="w-2.5 h-2.5 bg-appAccent rounded-full" />}
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
              className="w-full py-4 bg-appAccent hover:bg-[#6d392c] text-white rounded-xl font-poppins font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102"
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
              <span className="text-sm font-sans font-normal text-appAccent">
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
            <div className="min-h-[5rem] md:min-h-[6rem] flex items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-appAccent leading-relaxed">
                {q.text}
              </h2>
            </div>

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
                    disabled={isLocked}
                    className={`w-full group relative overflow-hidden rounded-2xl p-4 md:p-5 text-left transition-all duration-300 transform border-2 focus:outline-none focus:ring-0 ${
                      isSelected
                        ? `bg-gradient-to-r ${bgColor} text-white border-transparent shadow-lg scale-105`
                        : 'bg-white text-text-primary border-gray-200 hover:border-appAccent hover:shadow-[0_8px_24px_rgba(133,72,54,0.12)] hover:scale-[1.03] hover:bg-orange-50'
                    }`}
                  >
                    {!isSelected && (
                      <div className="absolute inset-0 bg-transparent group-hover:bg-orange-50 transition-all duration-300" />
                    )}
                    <div className="relative flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected ? 'bg-white border-white' : 'border-gray-400 group-hover:border-appAccent'
                        }`}
                      >
                        {isSelected && <div className="w-3 h-3 bg-appAccent rounded-full animate-pulse-ring" />}
                      </div>
                      <span className="font-inter font-semibold text-base md:text-lg">{opt.l}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-gray-500 text-sm font-inter mt-6">
              Pilih jawaban yang paling sesuai dengan perasaan Anda
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 animate-fade-in">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 py-3 px-6 bg-white text-appAccent border-2 border-appAccent rounded-xl font-poppins font-bold hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={isLast ? handleFinish : handleNext}
              disabled={!answers[currentIndex] || isLocked}
              className={`flex-1 py-3 px-6 rounded-xl font-poppins font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                isLast
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
                  : 'bg-appAccent hover:bg-[#6d392c] hover:shadow-lg'
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
