from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import logging

from app.services.expert_system import (
    cache,
    calculate_cf_and_holland,
    get_recommendations,
    calculate_saw
)

logger = logging.getLogger(__name__)

router = APIRouter()

class SubmitAnswers(BaseModel):
    nama: str = "Anonim"
    jawaban: List[int] # Harus berisi array 30 angka (1-5)
    target_job_zone: int = 0 # 0=Semua, 1/2=SMA, 3=D3, 4=S1, 5=S2/S3

@router.get("/data-check")
async def check_data():
    return {
        "status": "success",
        "total_questions_loaded": len(cache.questions),
        "total_occupations_loaded": len(cache.occupations),
        "sample_question": cache.questions[0] if cache.questions else None,
        "sample_occupation": cache.occupations[0] if cache.occupations else None
    }

@router.post("/refresh-data")
async def refresh_data():
    cache.load_data()
    return {
        "status": "success",
        "message": "Cache berhasil direfresh dari database.",
        "total_questions": len(cache.questions),
        "total_occupations": len(cache.occupations)
    }

@router.get("/questions")
async def get_questions():
    """
    Endpoint ini akan dipanggil oleh frontend saat halaman pertama kali dimuat
    untuk menampilkan daftar 30 soal kuesioner kepada pengguna.
    """
    if not cache.questions:
        return {"error": "Data pertanyaan belum dimuat ke memori."}
        
    return {
        "status": "success",
        "total_soal": len(cache.questions),
        "data": cache.questions
    }

@router.post("/calculate-result")
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

    # 3 & 4 & 5. Certainty Factor & Holland Code
    cf_final, kode_holland = calculate_cf_and_holland(data.jawaban)
    logger.info(f"Holland Code hasil: {kode_holland}")

    # 6. Forward Chaining Filter (Cari kandidat profesi)
    rekomendasi, jobs_with_errors = get_recommendations(kode_holland, data.target_job_zone)

    # 7. METODE SAW (Simple Additive Weighting)
    hasil_akhir_profesi = calculate_saw(data.jawaban, cf_final, rekomendasi)

    # 8. Kirim Output ke Frontend
    sorted_cf_dict = dict(sorted(cf_final.items(), key=lambda x: x[1], reverse=True))

    return {
        "status": "success",
        "nama_user": data.nama,
        "kode_holland": kode_holland,
        "detail_persentase": sorted_cf_dict,
        "metode_perankingan": "Certainty Factor + SAW (Absolute Normalization)",
        "bobot_kriteria": {
            "C1_kesesuaian_holland": 0.60,
            "C2_kesesuaian_keyword": 0.40,
        },
        "total_kandidat_saw": len(rekomendasi),
        "total_rekomendasi_ditemukan": len(hasil_akhir_profesi),
        "rekomendasi_profesi": hasil_akhir_profesi,
        "data_quality": {
            "total_occupations_processed": len(cache.occupations),
            "occupations_with_errors": len(jobs_with_errors),
            "error_details": jobs_with_errors[:5]
        }
    }
