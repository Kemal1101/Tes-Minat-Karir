import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import csv
from pydantic import BaseModel
from typing import List
from itertools import permutations

# ==========================================
# 1. VARIABEL GLOBAL (Penyimpan Data di RAM)
# ==========================================
QUESTIONS = []
OCCUPATIONS = []

# ==========================================
# 2. LIFESPAN (Data Loader saat Startup)
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    global QUESTIONS, OCCUPATIONS
    
    # Dapatkan lokasi folder (direktori) tempat main.py berada
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Gabungkan lokasi folder dengan nama file
    path_questions = os.path.join(BASE_DIR, "data", "questions.json")
    path_occupations = os.path.join(BASE_DIR, "data", "occupations.csv")
    
    print("[INFO] Memuat data statis ke dalam memori...")
    
    try:
        with open(path_questions, "r", encoding="utf-8") as f:
            QUESTIONS = json.load(f)
    except Exception as e:
        print(f"[ERROR] Gagal memuat questions.json: {e}")

    try:
        with open(path_occupations, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=';') 
            OCCUPATIONS = [row for row in reader]
    except Exception as e:
        print(f"[ERROR] Gagal memuat occupations.csv: {e}")

    yield 
    QUESTIONS.clear()
    OCCUPATIONS.clear()
    
    # --- PROSES SHUTDOWN ---
    # (Opsional: Bersihkan memori jika server dimatikan)
    QUESTIONS.clear()
    OCCUPATIONS.clear()
    print("[INFO] Server dimatikan, memori dibersihkan.")

# ==========================================
# 3. INISIALISASI APP & CORS
# ==========================================
class SubmitAnswers(BaseModel):
    nama: str = "Anonim"
    jawaban: List[int] # Harus berisi array 30 angka (1-5)

app = FastAPI(
    title="RIASEC Career Profiler API",
    lifespan=lifespan # Memasang fungsi lifespan ke aplikasi
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 4. ENDPOINTS
# ==========================================
@app.get("/")
async def root():
    return {"message": "Welcome to RIASEC Career Profiler API"}

# Endpoint baru untuk mengecek apakah data berhasil dimuat!
@app.get("/api/data-check")
async def check_data():
    return {
        "status": "success",
        "total_questions_loaded": len(QUESTIONS),
        "total_occupations_loaded": len(OCCUPATIONS),
        "sample_question": QUESTIONS[0] if QUESTIONS else None,
        "sample_occupation": OCCUPATIONS[0] if OCCUPATIONS else None
    }

# ==========================================
# KONFIGURASI SISTEM PAKAR
# ==========================================
KATEGORI_SOAL = (['R']*5) + (['I']*5) + (['A']*5) + (['S']*5) + (['E']*5) + (['C']*5)

# Simulasi nilai pakar untuk 5 pertanyaan (Sangat Kuat, Kuat, Cukup, dll)
# Digandakan 6x karena ada 6 dimensi (Total 30 bobot pakar)
CF_PAKAR = [1.0, 0.8, 0.8, 1.0, 0.6] * 6 

def likert_to_cf(nilai: int) -> float:
    """Mengubah skala Likert 1-5 menjadi nilai kepastian User (0.0 - 1.0)"""
    konversi = {5: 1.0, 4: 0.8, 3: 0.4, 2: 0.2, 1: 0.0}
    return konversi.get(nilai, 0.0)

# ==========================================
# ENDPOINT MESIN INFERENSI (CORE LOGIC)
# ==========================================
@app.post("/api/calculate-result")
async def calculate_result(data: SubmitAnswers):
    # 1. Validasi Input
    if len(data.jawaban) != 30:
        return {"error": "Jumlah jawaban harus tepat 30."}

    # 2. RULE 1: Hitung Certainty Factor Tunggal (CF_Pakar * CF_User)
    cf_tunggal = {'R': [], 'I': [], 'A': [], 'S': [], 'E': [], 'C': []}
    
    for i, ans in enumerate(data.jawaban):
        kat = KATEGORI_SOAL[i]           # Cari dimensinya apa (R/I/A/S/E/C)
        cf_user = likert_to_cf(ans)      # Konversi jawaban user
        cf_he = CF_PAKAR[i] * cf_user    # Kalikan dengan bobot pakar
        cf_tunggal[kat].append(cf_he)

    # 3. RULE 2: Kalkulasi CF Kombinasi Iteratif per Kategori
    cf_final = {}
    for kat, list_cf in cf_tunggal.items():
        cf_old = list_cf[0]
        for cf_new in list_cf[1:]:
            cf_old = cf_old + cf_new * (1 - cf_old)
        cf_final[kat] = round(cf_old * 100, 2)

    # 4. RULE 3: Tentukan Top 3 (Holland Code)
    # Urutkan berdasarkan persentase tertinggi
    sorted_cf = sorted(cf_final.items(), key=lambda x: x[1], reverse=True)
    top_3_kategori = sorted_cf[:3]
    kode_holland = "".join([k[0] for k in top_3_kategori]) # Misal: "SIC"

    # 5. RULE 4: Cari Profesi (Forward Chaining)
    rekomendasi = []
    
    # Pencarian Level 1 (Exact Match - Misal: Harus tepat "SIC")
    for job in OCCUPATIONS:
        if str(job.get('Interest Code', '')).startswith(kode_holland):
            rekomendasi.append(job)

    # Pencarian Level 2 (Permutasi) - Jika Level 1 kurang dari 10 pekerjaan
    if len(rekomendasi) < 10:
        # Putar urutan huruf, misal: CSI, ISC, CIS, dll.
        semua_perm = [''.join(p) for p in permutations(kode_holland) if ''.join(p) != kode_holland]
        for perm in semua_perm:
            for job in OCCUPATIONS:
                if str(job.get('Interest Code', '')).startswith(perm) and job not in rekomendasi:
                    rekomendasi.append(job)
            if len(rekomendasi) >= 15: # Batasi agar tidak terlalu banyak
                break

    # Batasi hasil akhir maksimal 10 rekomendasi teratas
    hasil_akhir_profesi = rekomendasi[:10]

    # 6. Kirim Output ke Frontend
    return {
        "nama_user": data.nama,
        "kode_holland": kode_holland,
        "detail_persentase": dict(sorted_cf),
        "total_rekomendasi_ditemukan": len(hasil_akhir_profesi),
        "rekomendasi_profesi": hasil_akhir_profesi
    }

# ==========================================
# ENDPOINT UNTUK MENGAMBIL SOAL
# ==========================================
@app.get("/api/questions")
async def get_questions():
    """
    Endpoint ini akan dipanggil oleh frontend saat halaman pertama kali dimuat
    untuk menampilkan daftar 30 soal kuesioner kepada pengguna.
    """
    if not QUESTIONS:
        return {"error": "Data pertanyaan belum dimuat ke memori."}
        
    return {
        "status": "success",
        "total_soal": len(QUESTIONS),
        "data": QUESTIONS
    }