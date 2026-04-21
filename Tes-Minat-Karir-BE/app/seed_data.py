import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Occupation, Question


def seed_questions(db: Session, questions_file: Path) -> tuple[int, int]:
	with questions_file.open("r", encoding="utf-8") as f:
		questions_data = json.load(f)

	inserted = 0
	updated = 0

	for item in questions_data:
		question_id = item.get("id")
		text = item.get("text", "").strip()
		category = item.get("category", "").strip().upper()
		cf_pakar = float(item.get("cf_pakar", 1.0))
		keywords = item.get("keywords", "").strip()

		if not question_id or not text or category not in {"R", "I", "A", "S", "E", "C"}:
			continue

		existing = db.query(Question).filter(Question.id == question_id).first()

		if existing:
			existing.text = text
			existing.category = category
			existing.cf_pakar = cf_pakar
			existing.keywords = keywords
			updated += 1
		else:
			db.add(
				Question(
					id=question_id,
					text=text,
					category=category,
					cf_pakar=cf_pakar,
					keywords=keywords
				)
			)
			inserted += 1

	db.commit()
	return inserted, updated


def main() -> None:
	root_dir = Path(__file__).resolve().parent.parent
	questions_file = root_dir / "data" / "questions.json"
	occupations_file = root_dir / "data" / "occupations.json"

	if not questions_file.exists():
		raise FileNotFoundError(f"File tidak ditemukan: {questions_file}")
	if not occupations_file.exists():
		raise FileNotFoundError(f"File tidak ditemukan: {occupations_file}")

	Base.metadata.create_all(bind=engine)

	db = SessionLocal()
	try:
		q_inserted, q_updated = seed_questions(db, questions_file)
	finally:
		db.close()

	print(
		"Seed selesai. "
		f"Questions -> Inserted: {q_inserted}, Updated: {q_updated}. "
	)


if __name__ == "__main__":
	main()