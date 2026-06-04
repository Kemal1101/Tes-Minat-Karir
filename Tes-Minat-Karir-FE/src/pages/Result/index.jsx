import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Radar } from "react-chartjs-2";

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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const riasecData = {
  R: { name: "Realistic",     description: "Tipe praktis, suka bekerja dengan mesin, alat, atau aktivitas luar ruangan." },
  I: { name: "Investigative", description: "Tipe analitis, suka memecahkan masalah, meneliti, dan ilmu pengetahuan." },
  A: { name: "Artistic",      description: "Tipe kreatif, imajinatif, dan suka mengekspresikan diri melalui seni dan desain." },
  S: { name: "Social",        description: "Tipe sosial, suka membantu, mengajar, dan berinteraksi dengan orang lain." },
  E: { name: "Enterprising",  description: "Tipe ambisius, suka memimpin, berbisnis, dan memengaruhi orang lain." },
  C: { name: "Conventional",  description: "Tipe teratur, teliti, dan suka bekerja dengan data, angka, atau prosedur yang jelas." }
};

const radarOptions = {
  scales: {
    r: { min: 0, max: 100, ticks: { stepSize: 20 } }
  },
  plugins: { legend: { display: false } }
};

function Navbar() {
  return (
    <nav className="bg-white border-b-4 border-accent shadow-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <div className="text-3xl font-poppins font-black">
          <span className="text-accent">RIASEC</span>
          <span className="text-saffron ml-2">Career</span>
        </div>
      </div>
    </nav>
  );
}

export default function Result() {
  const location = useLocation();
  const [showAllCareers, setShowAllCareers] = useState(false);
  const apiResult = location.state?.apiResult;
  const scores = apiResult.detail_persentase;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const radarData = {
    labels: sorted.map(([code]) => riasecData[code]?.name ?? code),
    datasets: [{
      data: sorted.map(([, score]) => score),
      backgroundColor: 'rgba(133,72,54,0.2)',
      borderColor: '#854836',
      borderWidth: 2,
      pointBackgroundColor: '#F5B553'
    }]
  };

  const careers = apiResult.rekomendasi_profesi ?? [];
  const visibleCareers = showAllCareers ? careers : careers.slice(0, 3);

  const medalClass = (i) => {
    if (i === 0) return 'bg-yellow-400 shadow-lg';
    if (i === 1) return 'bg-gray-300 shadow-md';
    if (i === 2) return 'bg-amber-600 shadow-md';
    return 'bg-accent';
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Navbar />

      <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-poppins font-black text-accent mb-2">
              Hasil Test Anda
            </h1>
            <p className="text-lg text-gray-600 font-inter">
              Profil minat karir berdasarkan RIASEC
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Radar Chart */}
            <div className="bg-white rounded-3xl shadow-md-custom p-8 animate-slide-up">
              <h2 className="text-2xl font-poppins font-bold text-accent mb-6">Profil Kamu</h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div className="mt-6 space-y-3">
                {sorted.map(([code, score]) => (
                  <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#854836' }} />
                      <span className="font-inter font-medium text-text-primary">
                        {riasecData[code]?.name ?? code}
                      </span>
                    </div>
                    <span className="font-poppins font-bold text-accent">{Math.round(score)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details + Careers */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Top 3 RIASEC types */}
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
                        {riasecData[code]?.name ?? code}
                        <span className="text-saffron ml-2">({Math.round(score)}%)</span>
                      </h3>
                      <p className="text-gray-600 font-inter text-sm leading-relaxed">
                        {riasecData[code]?.description ?? ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Career Recommendations */}
              <div className="bg-white rounded-3xl shadow-md-custom p-6 border-t-4 border-saffron">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-poppins font-bold text-accent">💼 Rekomendasi Karir</h3>
                  <span className="text-sm font-inter text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Berdasarkan {apiResult.metode_perankingan || 'SAW'}
                  </span>
                </div>

                <div className="space-y-4">
                  {visibleCareers.map((career, index) => {
                    const jobName = typeof career === 'object'
                      ? (career.Occupation || career.nama_pekerjaan || career.job_title)
                      : career;
                    const score = typeof career === 'object'
                      ? (career.Skor_SAW || career.skor || '')
                      : '';
                    const code = typeof career === 'object'
                      ? (career['Interest Code'] || '')
                      : '';

                    return (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gradient-to-r from-bg-light to-white rounded-2xl border border-gray-100 hover:border-saffron hover:shadow-md transition-all group"
                      >
                        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-poppins font-bold text-white mr-4 ${medalClass(index)}`}>
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

                {careers.length > 3 && (
                  <button
                    onClick={() => setShowAllCareers(!showAllCareers)}
                    className="mt-6 w-full py-3 bg-gray-50 hover:bg-gray-100 text-accent font-poppins font-semibold rounded-xl transition-colors border border-gray-200"
                  >
                    {showAllCareers ? 'Sembunyikan' : `Lihat Semua Pekerjaan (${careers.length})`}
                  </button>
                )}
              </div>

              {/* Restart */}
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