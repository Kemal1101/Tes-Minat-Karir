import sys
import os

# Add the project root to the sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app.services.expert_system import cache, calculate_cf_and_holland, get_recommendations, calculate_saw

def run_simulation(name, jawaban):
    print(f"=== Simulasi: {name} ===")
    
    # Run CF and Holland
    cf_final, kode_holland = calculate_cf_and_holland(jawaban)
    print(f"Kode Holland: {kode_holland}")
    print(f"CF Final: {cf_final}")
    
    # Get Recommendations (Target Zone 0 means all zones)
    rekomendasi, errors = get_recommendations(kode_holland, 0)
    print(f"Jumlah Rekomendasi Awal: {len(rekomendasi)}")
    
    # Calculate SAW
    hasil_saw = calculate_saw(jawaban, cf_final, rekomendasi)
    print("Top 5 Pekerjaan:")
    for i, job in enumerate(hasil_saw[:5]):
        print(f"  {i+1}. {job['Occupation']} (Code: {job['Interest Code']}) - Skor: {job['Skor_SAW']}")
    print("-" * 40 + "\n")

if __name__ == "__main__":
    # Load cache first
    print("Memuat cache...")
    cache.load_data()
    print("Cache dimuat.\n")
    
    # Scenario 1: Strongly Realistic
    # 30 questions. 
    # R: 1-5 (5s)
    # I: 6-10 (3s)
    # A: 11-15 (1s)
    # S: 16-20 (3s)
    # E: 21-25 (3s)
    # C: 26-30 (3s)
    jawaban_r_strong = [5]*5 + [3]*5 + [1]*5 + [3]*5 + [3]*5 + [3]*5
    run_simulation("Realistic Sangat Dominan, Artistic Sangat Rendah", jawaban_r_strong)
    
    # Scenario 2: Neutral Everything
    jawaban_netral = [3]*30
    run_simulation("User Netral (Ragu-ragu pada Semua Soal)", jawaban_netral)
    
    # Scenario 3: Slightly Mixed (I and C high)
    jawaban_mixed = [3]*5 + [5]*5 + [2]*5 + [3]*5 + [2]*5 + [4]*5
    run_simulation("Investigative & Conventional Tinggi", jawaban_mixed)
    
    # Scenario 4: Strongly Hate Everything (1s)
    jawaban_hate = [1]*30
    run_simulation("Sangat Tidak Setuju Semua (Hater)", jawaban_hate)
