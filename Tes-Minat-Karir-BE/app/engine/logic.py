from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List
from itertools import permutations
import logging

from app.database import SessionLocal
from app.models import Question, OccupationRiasec

# Konfigurasi logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================
# 1. VARIABEL GLOBAL (Penyimpan Data di RAM)
# ==========================================
QUESTIONS = []
OCCUPATIONS = []

# ==========================================
# 2. LIFESPAN (Data Loader saat Startup)
# ==========================================
def load_data():
    global QUESTIONS, OCCUPATIONS
    logger.info("Memuat data statis ke dalam memori...")
    
    # Load Questions dari database
    try:
        db = SessionLocal()
        try:
            questions = db.query(Question).order_by(Question.id.asc()).all()
            QUESTIONS = [
                {
                    "id": q.id,
                    "text": q.text,
                    "category": q.category,
                    "keywords": q.keywords,
                    "cf_pakar": q.cf_pakar,
                }
                for q in questions
            ]
        finally:
            db.close()

        logger.info(f"Questions berhasil dimuat dari database: {len(QUESTIONS)} soal")
    except Exception as e:
        logger.error(f"Gagal memuat questions dari database: {e}")

    # Load dan Validasi Occupations dari database
    try:
        db = SessionLocal()
        try:
            raw_occupations = db.query(OccupationRiasec).order_by(OccupationRiasec.id.asc()).all()
        finally:
            db.close()
        
        # ✅ Validasi & sanitasi Interest Code saat load
        OCCUPATIONS = []
        invalid_jobs = []
        
        for idx, job in enumerate(raw_occupations):
            original_code = job.interest_code or ""
            clean_code = sanitize_interest_code(original_code)

            job_dict = {
                "Interest Code": clean_code,
                "Job Zone": job.job_zone,
                "Code": job.code,
                "Occupation": job.occupation,
            }
            
            # Cek validasi
            if not clean_code:
                invalid_jobs.append({
                    "index": idx,
                    "occupation": job.occupation or "Unknown",
                    "original_code": original_code,
                    "reason": "EMPTY_OR_INVALID_CODE"
                })
                logger.warning(f"Job {idx} ({job.occupation}) has invalid Interest Code: '{original_code}'")
            
            # Simpan dengan clean code
            OCCUPATIONS.append(job_dict)
        
        logger.info(f"Occupations berhasil dimuat: {len(OCCUPATIONS)} profesi")
        if invalid_jobs:
            logger.warning(f"Ditemukan {len(invalid_jobs)} profesi dengan Interest Code tidak valid")
            # Log detail untuk 5 profesi pertama yang bermasalah
            for job_info in invalid_jobs[:5]:
                logger.warning(f"  - {job_info['occupation']}: '{job_info['original_code']}'")
            if len(invalid_jobs) > 5:
                logger.warning(f"  ... dan {len(invalid_jobs) - 5} profesi lainnya")
    
    except Exception as e:
        logger.error(f"Gagal memuat occupations dari database: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_data()
    yield 
    
    # --- PROSES SHUTDOWN ---
    QUESTIONS.clear()
    OCCUPATIONS.clear()
    logger.info("Server dimatikan, memori dibersihkan.")

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

# Endpoint untuk reload data dari database tanpa restart server
@app.post("/api/refresh-data")
async def refresh_data():
    load_data()
    return {
        "status": "success",
        "message": "Cache berhasil direfresh dari database.",
        "total_questions": len(QUESTIONS),
        "total_occupations": len(OCCUPATIONS)
    }

# ==========================================
# KONFIGURASI SISTEM PAKAR
# ==========================================
# (Data cf_pakar dan kategori sekarang diambil dinamis dari database 
# tabel Questions pada saat startup di fungsi lifespan)

def likert_to_cf(nilai: int) -> float:
    """Mengubah skala Likert 1-5 menjadi nilai kepastian User (0.0 - 1.0)"""
    konversi = {5: 1.0, 4: 0.8, 3: 0.4, 2: 0.2, 1: 0.0}
    return konversi.get(nilai, 0.0)

# ==========================================
# HELPER FUNCTIONS: SANITASI & VALIDASI
# ==========================================
def sanitize_interest_code(code: str) -> str:
    """
    Bersihkan dan validasi Interest Code:
    - Hapus whitespace
    - Convert ke uppercase
    - Hapus karakter khusus (hanya ambil A-Z)
    - Validasi hanya berisi R, I, A, S, E, C
    """
    if not code or code is None:
        return ""
    
    # Convert ke string dan uppercase
    code = str(code).strip().upper()
    
    # Hapus karakter selain A-Z
    code = ''.join(c for c in code if c.isalpha())
    
    # Validasi hanya berisi R, I, A, S, E, C
    valid_chars = set('RIASEC')
    code = ''.join(c for c in code if c in valid_chars)
    
    return code

def is_valid_interest_code(code: str) -> bool:
    """
    Cek apakah Interest Code valid:
    - Tidak kosong
    - Mengandung R, I, A, S, E, C
    - Panjang minimal 2 huruf dan maksimal 6
    """
    if not code:
        return False
    
    code = sanitize_interest_code(code)
    
    # Harus minimal 2 huruf dan maksimal 6
    if len(code) < 2 or len(code) > 6:
        return False
    
    # Cek hanya berisi RIASEC
    valid_chars = set('RIASEC')
    return all(c in valid_chars for c in code)

# ==========================================
# ENDPOINT MESIN INFERENSI (CORE LOGIC)
# ==========================================
@app.post("/api/calculate-result")
async def calculate_result(data: SubmitAnswers):
    # 1. Validasi Input - Jumlah Jawaban
    if len(data.jawaban) != 30:
        return {
            "status": "error",
            "code": "INVALID_ANSWER_COUNT",
            "message": "Jumlah jawaban harus tepat 30.",
            "details": {"jawaban_count": len(data.jawaban)}
        }

    # 2. Validasi Input - Nilai Jawaban
    for i, ans in enumerate(data.jawaban):
        if ans not in [1, 2, 3, 4, 5]:
            return {
                "status": "error",
                "code": "INVALID_ANSWER_VALUE",
                "message": f"Jawaban harus 1-5, menerima {ans} di soal {i+1}",
                "details": {"soal": i+1, "nilai": ans}
            }
    
    logger.info(f"Memproses hasil untuk user: {data.nama}")

    # 3. RULE 1: Hitung Certainty Factor Tunggal (CF_Pakar * CF_User)
    cf_tunggal = {'R': [], 'I': [], 'A': [], 'S': [], 'E': [], 'C': []}
    
    for i, ans in enumerate(data.jawaban):
        if i >= len(QUESTIONS):
            break # Hindari error index out of range jika data DB kurang dari 30
            
        kat = str(QUESTIONS[i].get("category", "R")).upper()
        cf_pakar_db = float(QUESTIONS[i].get("cf_pakar", 0.0))
        
        cf_user = likert_to_cf(ans)             # Konversi jawaban user
        cf_he = cf_pakar_db * cf_user           # Kalikan dengan bobot pakar dari DB
        
        if kat in cf_tunggal:
            cf_tunggal[kat].append(cf_he)

    # 4. RULE 2: Kalkulasi CF Kombinasi Iteratif per Kategori
    cf_final = {}
    for kat, list_cf in cf_tunggal.items():
        if not list_cf:
            cf_final[kat] = 0.0
            continue
        cf_old = list_cf[0]
        for cf_new in list_cf[1:]:
            cf_old = cf_old + cf_new * (1 - cf_old)
        cf_final[kat] = round(cf_old * 100, 2)

    # 5. RULE 3: Tentukan Top 3 (Holland Code)
    # Urutkan berdasarkan persentase tertinggi
    sorted_cf = sorted(cf_final.items(), key=lambda x: x[1], reverse=True)
    top_3_kategori = sorted_cf[:3]
    kode_holland = "".join([k[0] for k in top_3_kategori]) # Misal: "SIC"
    
    logger.info(f"Holland Code hasil: {kode_holland}")

    # 6. RULE 4: Cari kandidat profesi (Forward Chaining Filter)
    rekomendasi = []
    job_ids_added = set()
    jobs_with_errors = []

    # Pencarian Level 1: Syarat Minimal 2 huruf cocok, atau huruf pertama cocok jika kode pekerjaan cuma 1 huruf
    for idx, job in enumerate(OCCUPATIONS):
        try:
            interest_code = sanitize_interest_code(job.get('Interest Code', ''))
            if not interest_code:
                jobs_with_errors.append({
                    "occupation": job.get('Occupation', 'Unknown'),
                    "original_code": job.get('Interest Code', ''),
                    "error": "EMPTY_OR_INVALID_CODE",
                    "level": 1
                })
                continue

            # Hitung irisan huruf antara Top 3 Holland User dan Interest Code Pekerjaan
            huruf_cocok = sum(1 for huruf in kode_holland if huruf in interest_code)
            
            is_match = False
            if len(interest_code) == 1 and interest_code in kode_holland:
                is_match = True
            elif huruf_cocok >= 2:
                is_match = True
                
            if is_match:
                job_id = job.get('Code') or job.get('Occupation') or str(idx)
                if job_id not in job_ids_added:
                    rekomendasi.append(job)
                    job_ids_added.add(job_id)

        except Exception as e:
            jobs_with_errors.append({
                "occupation": job.get('Occupation', 'Unknown'),
                "error": f"EXCEPTION: {str(e)}",
                "level": 1
            })
            logger.error(f"Error processing job at index {idx}: {e}")

    # Pencarian Level 2 (Kelonggaran): Jika kandidat kurang dari 10, ambil pekerjaan yang setidaknya 
    # memiliki huruf pertama yang sama dengan salah satu Top 3 dari Holland Code User.
    if len(rekomendasi) < 10:
        for idx, job in enumerate(OCCUPATIONS):
            try:
                interest_code = sanitize_interest_code(job.get('Interest Code', ''))
                if not interest_code:
                    continue

                if interest_code[0] in kode_holland:
                    job_id = job.get('Code') or job.get('Occupation') or str(idx)
                    if job_id not in job_ids_added:
                        rekomendasi.append(job)
                        job_ids_added.add(job_id)

            except Exception as e:
                jobs_with_errors.append({
                    "occupation": job.get('Occupation', 'Unknown'),
                    "error": f"EXCEPTION: {str(e)}",
                    "level": 2
                })
                logger.error(f"Error processing job at index {idx} (Level 2): {e}")

            if len(rekomendasi) >= 25:
                break

    # 7. METODE SAW (Simple Additive Weighting)
    # C1 = Kesesuaian Holland (60%), C2 = Kesesuaian Keyword (40%)
    W1 = 0.60
    W2 = 0.40

    # Tahap 1: Kumpulkan skor keyword user dari pertanyaan yang dijawab >= 3
    keyword_scores = {}
    for i, ans in enumerate(data.jawaban):
        if ans < 3 or i >= len(QUESTIONS):
            continue

        keywords_db = QUESTIONS[i].get("keywords", "") if isinstance(QUESTIONS[i], dict) else ""
        if not keywords_db:
            continue

        for kata in str(keywords_db).split(','):
            kata_bersih = kata.strip().lower()
            if not kata_bersih:
                continue
            if kata_bersih not in keyword_scores or ans > keyword_scores[kata_bersih]:
                keyword_scores[kata_bersih] = ans

    # Tahap 2: Bentuk matriks keputusan (C1, C2)
    import re
    matriks_keputusan = []
    for job in rekomendasi:
        # C1: agregasi nilai CF (Dibatasi maksimal 3 huruf pertama untuk mencegah bias)
        c1_score = 0.0
        job_code = sanitize_interest_code(job.get('Interest Code', ''))
        
        # Ambil maksimal 3 huruf pertama interest_code agar profesi berkode panjang 
        # tidak otomatis mendapatkan nilai C1 lebih tinggi dari profesi berkode 2/3 huruf
        top_letters = job_code[:3]
        
        # Bobot posisi (Positional Weighting):
        # Huruf ke-1 memiliki nilai lebih tinggi dibanding huruf ke-2 dan ke-3
        position_weights = [1.0, 0.75, 0.5]
        
        for idx, letter in enumerate(top_letters):
            if letter in cf_final:
                weight = position_weights[idx] if idx < len(position_weights) else 0.5
                c1_score += float(cf_final[letter]) * weight

        # C2: relevansi keyword user terhadap nama pekerjaan
        c2_score = 0.0
        job_title = str(job.get('Occupation', '')).lower()
        for kata, poin in keyword_scores.items():
            # Regex diubah agar menoleransi akhiran s, es, ing, ers, dll.
            # Contoh: "engineer" akan cocok dengan "engineers" atau "engineering"
            pattern = r'\b' + re.escape(kata) + r'(?:s|es|ing|ers|ed)?\b'
            if re.search(pattern, job_title):
                c2_score += float(poin)
                
        matriks_keputusan.append({
            "job": job,
            "C1": c1_score,
            "C2": c2_score
        })

    # Tahap 3: Normalisasi matriks (benefit criteria)
    max_c1 = max((item["C1"] for item in matriks_keputusan), default=0.0)
    max_c2 = max((item["C2"] for item in matriks_keputusan), default=0.0)

    penyebut_c1 = max_c1 if max_c1 > 0 else 1.0
    penyebut_c2 = max_c2 if max_c2 > 0 else 1.0

    # Tahap 4: Hitung nilai preferensi akhir Vi
    hasil_akhir_saw = []
    for item in matriks_keputusan:
        r1 = item["C1"] / penyebut_c1
        r2 = item["C2"] / penyebut_c2
        vi = (r1 * W1) + (r2 * W2)
        skor_saw_persen = round(vi * 100, 2)

        job_data = dict(item["job"])
        job_data["Skor_SAW"] = f"{skor_saw_persen}%"

        hasil_akhir_saw.append({
            "data": job_data,
            "skor": skor_saw_persen
        })

    # Tahap 5: Urutkan berdasarkan skor SAW tertinggi
    hasil_akhir_saw.sort(key=lambda x: x["skor"], reverse=True)
    hasil_akhir_profesi = [item["data"] for item in hasil_akhir_saw[:10]]

    logger.info(f"Rekomendasi SAW ditemukan: {len(hasil_akhir_profesi)} dari {len(rekomendasi)} kandidat")

    # 8. Kirim Output ke Frontend
    return {
        "status": "success",
        "nama_user": data.nama,
        "kode_holland": kode_holland,
        "detail_persentase": dict(sorted_cf),
        "metode_perankingan": "Certainty Factor + SAW",
        "bobot_kriteria": {
            "C1_kesesuaian_holland": W1,
            "C2_kesesuaian_keyword": W2,
        },
        "total_kandidat_saw": len(rekomendasi),
        "total_rekomendasi_ditemukan": len(hasil_akhir_profesi),
        "rekomendasi_profesi": hasil_akhir_profesi,
        "data_quality": {
            "total_occupations_processed": len(OCCUPATIONS),
            "occupations_with_errors": len(jobs_with_errors),
            "error_details": jobs_with_errors[:5]
        }
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