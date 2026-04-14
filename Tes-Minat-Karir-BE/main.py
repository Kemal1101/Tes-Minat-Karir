from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import csv

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
    # --- PROSES STARTUP ---
    global QUESTIONS, OCCUPATIONS
    
    print("[INFO] Memuat data statis ke dalam memori...")
    
    # Membaca data pertanyaan (JSON)
    try:
        with open("data/questions.json", "r", encoding="utf-8") as f:
            QUESTIONS = json.load(f)
        print(f"[OK] Berhasil memuat {len(QUESTIONS)} pertanyaan.")
    except Exception as e:
        print(f"[ERROR] Gagal memuat questions.json: {e}")

    # Membaca data profesi (CSV)
    try:
        with open("data/occupations.csv", "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            OCCUPATIONS = [row for row in reader]
        print(f"[OK] Berhasil memuat {len(OCCUPATIONS)} profesi O*NET.")
    except Exception as e:
        print(f"[ERROR] Gagal memuat occupations.csv: {e}")

    # Server siap menerima request
    yield 
    
    # --- PROSES SHUTDOWN ---
    # (Opsional: Bersihkan memori jika server dimatikan)
    QUESTIONS.clear()
    OCCUPATIONS.clear()
    print("[INFO] Server dimatikan, memori dibersihkan.")

# ==========================================
# 3. INISIALISASI APP & CORS
# ==========================================
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