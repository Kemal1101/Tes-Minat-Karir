import React, { useState, useEffect } from 'react';
import { questions, riasecData } from './questions';
import './App.css';

import {
  Radar
} from 'react-chartjs-2';

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

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
    setShowValidation(false);
    
    // Auto-advance ke pertanyaan berikutnya setelah 600ms
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsTransitioning(false);
        }, 300);
      }
    }, 600);
  };

  const handleNext = () => {
    if (!answers[currentIndex]) {
      setShowValidation(true);
      return;
    }
    
    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleFinish = () => {
    if (!answers[currentIndex]) {
      setShowValidation(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsFinished(true);
    }, 1500);
  };

  const calculateResults = () => {
    const totals = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    answers.forEach((val, idx) => {
      if (val) totals[questions[idx].category] += val;
    });

    const normalized = {};
    Object.keys(totals).forEach(key => {
      normalized[key] = Math.round((totals[key] / 25) * 100);
    });

    return normalized;
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
  if (isFinished) {
    const scores = calculateResults();
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topCode = sorted[0][0];

    const radarData = {
      labels: sorted.map(([code]) => riasecData[code].name),
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
                          {riasecData[code].name}
                        </span>
                      </div>
                      <span className="font-poppins font-bold text-accent">{score}%</span>
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
                          {riasecData[code].name}
                          <span className="text-saffron ml-2">({score}%)</span>
                        </h3>
                        <p className="text-gray-600 font-inter text-sm leading-relaxed">
                          {riasecData[code].description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Career Recommendations */}
                <div className="bg-gradient-to-br from-saffron/10 to-accent/5 rounded-3xl shadow-md-custom p-6">
                  <h3 className="text-lg font-poppins font-bold text-accent mb-4">
                    💼 Rekomendasi Karir
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {riasecData[topCode].careers.map((career) => (
                      <span
                        key={career}
                        className="inline-block px-4 py-2 bg-white text-accent rounded-full font-inter font-medium text-sm border border-accent/20 hover:border-accent/50 transition-all"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Restart Button */}
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
    );
  }

  /* ================= TEST ================= */
  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const options = [
    { v: 1, l: 'Sangat Tidak Suka' },
    { v: 2, l: 'Tidak Suka' },
    { v: 3, l: 'Netral' },
    { v: 4, l: 'Suka' },
    { v: 5, l: 'Sangat Suka' },
  ];

  const getOptionColor = (value) => {
    if (answers[currentIndex] === value) {
      if (value === 5 || value === 4) return 'from-green-500 to-emerald-500';
      if (value === 3) return 'from-yellow-500 to-amber-500';
      return 'from-red-500 to-orange-500';
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      {/* Navbar (non-sticky — will scroll with page) */}
      <nav className="bg-white border-b-4 border-accent shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <div className="text-3xl font-poppins font-black">
            <span className="text-accent">RIASEC</span>
            <span className="text-saffron ml-2">Career</span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Section */}
          <div className="mb-8 animate-fade-in">
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden shadow-soft mb-3">
              <div
                className="h-full bg-gradient-to-r from-accent to-saffron rounded-full transition-all duration-500 ease-out shadow-md"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-poppins font-bold text-accent">
                Pertanyaan {currentIndex + 1} dari {questions.length}
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
            {/* Question Header */}
            
            {/* Question Text */}
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-accent leading-relaxed mb-8">
              {q.text}
            </h2>

            {/* Validation Message */}
            {showValidation && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
                <p className="text-red-700 font-inter font-medium text-sm">
                  ⚠️ Silakan pilih salah satu opsi jawaban sebelum melanjutkan
                </p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.v;
                const bgColor = getOptionColor(opt.v);

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
                    {/* Background animation for hover */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-saffron/0 group-hover:from-accent/5 group-hover:to-saffron/5 transition-all duration-300"></div>
                    )}

                    <div className="relative flex items-center gap-4">
                      {/* Radio Circle */}
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-white border-white'
                            : 'border-gray-400 group-hover:border-accent'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 bg-accent rounded-full animate-pulse-ring"></div>
                        )}
                      </div>

                      {/* Text */}
                      <span className="font-inter font-semibold text-base md:text-lg">
                        {opt.l}
                      </span>

                      {/* Checkmark for selected */}
                      {isSelected && (
                        <span className="ml-auto text-xl">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Helper Text */}
            <p className="text-center text-gray-500 text-sm font-inter mt-6">
              Pilih jawaban yang paling sesuai dengan perasaan Anda →
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 animate-fade-in">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 py-3 px-6 bg-white text-accent border-2 border-accent rounded-xl font-poppins font-bold hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              ← Sebelumnya
            </button>

            <button
              onClick={currentIndex === questions.length - 1 ? handleFinish : handleNext}
              disabled={!answers[currentIndex]}
              className={`flex-1 py-3 px-6 rounded-xl font-poppins font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                currentIndex === questions.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
                  : 'bg-gradient-to-r from-accent to-accent-dark hover:shadow-lg'
              }`}
            >
              {currentIndex === questions.length - 1
                ? '🎉 Lihat Hasil'
                : 'Selanjutnya →'}
            </button>
          </div>

          {/* Progress Info */}
          <div className="mt-6 text-center text-gray-500 text-sm font-inter">
            💡 Jawaban Anda akan secara otomatis menyimpan dan pindah ke pertanyaan berikutnya
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;