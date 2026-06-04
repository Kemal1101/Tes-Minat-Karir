import logging
import re
from typing import List, Dict, Any, Tuple
from app.database import SessionLocal
from app.models import Question, OccupationRiasec

logger = logging.getLogger(__name__)

class DataCache:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataCache, cls).__new__(cls)
            cls._instance.questions = []
            cls._instance.occupations = []
        return cls._instance

    def load_data(self):
        logger.info("Memuat data statis ke dalam memori...")
        self.questions.clear()
        self.occupations.clear()
        
        # Load Questions
        try:
            db = SessionLocal()
            try:
                questions = db.query(Question).order_by(Question.id.asc()).all()
                for q in questions:
                    # Pre-compile regex for keywords to optimize performance
                    keywords_list = []
                    compiled_patterns = []
                    if q.keywords:
                        for kata in str(q.keywords).split(','):
                            kata_bersih = kata.strip().lower()
                            if kata_bersih:
                                keywords_list.append(kata_bersih)
                                # Precompile regex
                                pattern = r'\b' + re.escape(kata_bersih) + r'(?:s|es|ing|ers|ed)?\b'
                                compiled_patterns.append((kata_bersih, re.compile(pattern)))
                                
                    self.questions.append({
                        "id": q.id,
                        "text": q.text,
                        "category": q.category,
                        "keywords": q.keywords,
                        "keywords_list": keywords_list,
                        "compiled_patterns": compiled_patterns,
                        "cf_pakar": q.cf_pakar,
                    })
            finally:
                db.close()
            logger.info(f"Questions berhasil dimuat dari database: {len(self.questions)} soal")
        except Exception as e:
            logger.error(f"Gagal memuat questions dari database: {e}")

        # Load Occupations
        try:
            db = SessionLocal()
            try:
                raw_occupations = db.query(OccupationRiasec).order_by(OccupationRiasec.id.asc()).all()
            finally:
                db.close()
            
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
                
                if not clean_code:
                    invalid_jobs.append({
                        "index": idx,
                        "occupation": job.occupation or "Unknown",
                        "original_code": original_code,
                        "reason": "EMPTY_OR_INVALID_CODE"
                    })
                
                self.occupations.append(job_dict)
            
            logger.info(f"Occupations berhasil dimuat: {len(self.occupations)} profesi")
            if invalid_jobs:
                logger.warning(f"Ditemukan {len(invalid_jobs)} profesi dengan Interest Code tidak valid")
        except Exception as e:
            logger.error(f"Gagal memuat occupations dari database: {e}")

    def clear(self):
        self.questions.clear()
        self.occupations.clear()

cache = DataCache()

def sanitize_interest_code(code: str) -> str:
    if not code or code is None:
        return ""
    code = str(code).strip().upper()
    code = ''.join(c for c in code if c.isalpha())
    valid_chars = set('RIASEC')
    return ''.join(c for c in code if c in valid_chars)

def is_valid_interest_code(code: str) -> bool:
    if not code:
        return False
    code = sanitize_interest_code(code)
    if len(code) < 2 or len(code) > 6:
        return False
    valid_chars = set('RIASEC')
    return all(c in valid_chars for c in code)

def likert_to_cf(nilai: int) -> float:
    konversi = {5: 1.0, 4: 0.8, 3: 0.4, 2: 0.2, 1: 0.0}
    return konversi.get(nilai, 0.0)

def calculate_cf_and_holland(jawaban: List[int]) -> Tuple[Dict[str, float], str]:
    cf_tunggal = {'R': [], 'I': [], 'A': [], 'S': [], 'E': [], 'C': []}
    questions = cache.questions
    
    for i, ans in enumerate(jawaban):
        if i >= len(questions):
            break
            
        kat = str(questions[i].get("category", "R")).upper()
        cf_pakar_db = float(questions[i].get("cf_pakar", 0.0))
        cf_user = likert_to_cf(ans)
        cf_he = cf_pakar_db * cf_user
        
        if kat in cf_tunggal:
            cf_tunggal[kat].append(cf_he)

    cf_final = {}
    for kat, list_cf in cf_tunggal.items():
        if not list_cf:
            cf_final[kat] = 0.0
            continue
        cf_old = list_cf[0]
        for cf_new in list_cf[1:]:
            cf_old = cf_old + cf_new * (1 - cf_old)
        cf_final[kat] = round(cf_old * 100, 2)

    sorted_cf = sorted(cf_final.items(), key=lambda x: x[1], reverse=True)
    top_3_kategori = sorted_cf[:3]
    kode_holland = "".join([k[0] for k in top_3_kategori])
    
    return cf_final, kode_holland

def get_recommendations(kode_holland: str, target_job_zone: int) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    rekomendasi = []
    job_ids_added = set()
    jobs_with_errors = []
    
    occupations = cache.occupations

    for idx, job in enumerate(occupations):
        try:
            interest_code = job.get('Interest Code', '')
            if not interest_code:
                jobs_with_errors.append({
                    "occupation": job.get('Occupation', 'Unknown'),
                    "error": "EMPTY_OR_INVALID_CODE",
                    "level": 1
                })
                continue

            huruf_cocok = sum(1 for huruf in kode_holland if huruf in interest_code)
            
            if target_job_zone > 0:
                job_zone_str = str(job.get('Job Zone', '')).strip()
                if job_zone_str and str(target_job_zone) not in job_zone_str:
                    continue
                    
            is_match = False
            if len(interest_code) == 1 and interest_code in kode_holland:
                is_match = True
            elif huruf_cocok >= 2:
                # PERBAIKAN AUDIT POIN 3: Mencegah Bias Forward Chaining
                # Memastikan huruf dominan (pertama) user ada di pekerjaan, atau sebaliknya.
                if (kode_holland[0] in interest_code) or (interest_code[0] in kode_holland):
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

    if len(rekomendasi) < 10:
        for idx, job in enumerate(occupations):
            try:
                interest_code = job.get('Interest Code', '')
                if not interest_code:
                    continue

                if target_job_zone > 0:
                    job_zone_str = str(job.get('Job Zone', '')).strip()
                    if job_zone_str and str(target_job_zone) not in job_zone_str:
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

            if len(rekomendasi) >= 25:
                break
                
    return rekomendasi, jobs_with_errors

def calculate_saw(jawaban: List[int], cf_final: Dict[str, float], rekomendasi: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # PERBAIKAN AUDIT POIN 7: Justifikasi Akademik Pembobotan
    # W1 (Kesesuaian Holland) diberi bobot dominan (60%) karena merupakan core assessment.
    # W2 (Kesesuaian Keyword/Title) diberi bobot minor (40%) karena hanya bersifat ekstraktif/heuristik.
    # Pembobotan ini menggunakan metode Heuristic Judgment (pakar). 
    W1 = 0.60
    W2 = 0.40
    questions = cache.questions

    keyword_scores = {}
    keyword_patterns = {}
    
    for i, ans in enumerate(jawaban):
        if ans < 3 or i >= len(questions):
            continue
        q = questions[i]
        compiled_patterns = q.get("compiled_patterns", [])
        for kata_bersih, pattern in compiled_patterns:
            if kata_bersih not in keyword_scores or ans > keyword_scores[kata_bersih]:
                keyword_scores[kata_bersih] = ans
                keyword_patterns[kata_bersih] = pattern

    matriks_keputusan = []
    for job in rekomendasi:
        c1_score = 0.0
        job_code = job.get('Interest Code', '')
        top_letters = job_code[:3]
        position_weights = [1.0, 0.75, 0.5]
        
        for idx, letter in enumerate(top_letters):
            if letter in cf_final:
                weight = position_weights[idx] if idx < len(position_weights) else 0.5
                c1_score += float(cf_final[letter]) * weight

        c2_score = 0.0
        job_title = str(job.get('Occupation', '')).lower()
        for kata, poin in keyword_scores.items():
            pattern = keyword_patterns[kata]
            if pattern.search(job_title):
                c2_score += float(poin)
                
        matriks_keputusan.append({
            "job": job,
            "C1": c1_score,
            "C2": c2_score
        })

    # BUG FIX: Normalisasi SAW menggunakan theoretical maximum (absolute score)
    penyebut_c1 = 225.0 # Max: 100*1 + 100*0.75 + 100*0.5
    penyebut_c2 = 15.0  # Max yang disetujui (Capping)

    hasil_akhir_saw = []
    for item in matriks_keputusan:
        r1 = min(item["C1"] / penyebut_c1, 1.0)
        r2 = min(item["C2"] / penyebut_c2, 1.0)
        
        vi = (r1 * W1) + (r2 * W2)
        skor_saw_persen = round(vi * 100, 2)

        job_data = dict(item["job"])
        job_data["Skor_SAW"] = f"{skor_saw_persen}%"

        hasil_akhir_saw.append({
            "data": job_data,
            "skor": skor_saw_persen
        })

    hasil_akhir_saw.sort(key=lambda x: x["skor"], reverse=True)
    return [item["data"] for item in hasil_akhir_saw[:10]]
