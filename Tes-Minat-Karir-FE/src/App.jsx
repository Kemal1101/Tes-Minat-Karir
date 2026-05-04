import React, { useState } from 'react';
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

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
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
      <div className="app">
        <nav className="navbar">
          <div className="logo">RIASEC<span>Career</span></div>
        </nav>

        <div className="loading-container">
          <div className="loader-blob"></div>
          <h2>Menganalisis hasil...</h2>
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
      <div className="app">
        <nav className="navbar">
          <div className="logo">RIASEC<span>Career</span></div>
        </nav>

        <div className="result-main">

          <div className="result-hero">
            <h1>Hasil Test Anda</h1>
            <p>Profil minat karir berdasarkan RIASEC</p>
          </div>

          <div className="result-grid">

            <div className="chart-section">
              <h2>Profil Kamu</h2>

              <div className="radar-container">
                <Radar data={radarData} options={radarOptions} />
              </div>

              <div className="radar-legend">
                {sorted.map(([code, score]) => (
                  <div key={code} className="legend-item">
                    <span className="legend-dot"></span>
                    <span className="legend-name">
                      {riasecData[code].name}
                    </span>
                    <span className="legend-value">{score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">

              {sorted.slice(0, 3).map(([code, score]) => (
                <div key={code} className="type-card">
                  <div className="type-letter">{code}</div>
                  <div>
                    <strong>{riasecData[code].name} ({score}%)</strong>
                    <p>{riasecData[code].description}</p>
                  </div>
                </div>
              ))}

              <div>
                <h3 style={{ marginBottom: "0.8rem", color: "#854836" }}>
                  Rekomendasi Karir
                </h3>

                <div className="career-tags">
                  {riasecData[topCode].careers.map(c => (
                    <span key={c} className="tag">{c}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <button
                  className="btn-primary"
                  onClick={() => window.location.reload()}
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
  const pct = ((currentIndex + 1) / questions.length) * 100;

  const options = [
    { v: 1, l: 'Sangat Tidak Suka' },
    { v: 2, l: 'Tidak Suka' },
    { v: 3, l: 'Netral' },
    { v: 4, l: 'Suka' },
    { v: 5, l: 'Sangat Suka' },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">RIASEC<span>Career</span></div>
      </nav>

      <div className="main">
        <div className="container">

          {/* PROGRESS */}
          <div className="test-header">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* QUESTION */}
          <div className="question-card">

            <div className="question-meta">
              <span className="question-number">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>

              <span className="question-category">
                {riasecData[q.category].name}
              </span>
            </div>

            <h2 className="question-text">{q.text}</h2>

            <div className="options">
              {options.map(opt => (
                <div
                  key={opt.v}
                  className={`option ${answers[currentIndex] === opt.v ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.v)}
                >
                  <div className="radio"></div>
                  <span>{opt.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NAV */}
          <div className="test-nav">
            <button
              className="btn-secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(v => v - 1)}
            >
              Sebelumnya
            </button>

            <button
              className="btn-primary"
              disabled={!answers[currentIndex]}
              onClick={() =>
                currentIndex === questions.length - 1
                  ? handleFinish()
                  : setCurrentIndex(v => v + 1)
              }
            >
              {currentIndex === questions.length - 1
                ? 'Lihat Hasil'
                : 'Selanjutnya'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;