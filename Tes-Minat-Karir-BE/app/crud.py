import random
import hashlib
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models import User, Question, OccupationRiasec, TokenBlacklist
from app.schemas import (
    UserCreate, UserUpdate,
    QuestionCreate, QuestionUpdate,
    OccupationCreate, OccupationUpdate
)
from app.auth import get_password_hash


def _normalize_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def blacklist_token(db: Session, token: str, user_id: int | None, expires_at: datetime):
    token_hash = hash_token(token)
    existing = db.query(TokenBlacklist).filter(TokenBlacklist.token_hash == token_hash).first()
    if existing:
        return existing

    entry = TokenBlacklist(
        token_hash=token_hash,
        user_id=user_id,
        expires_at=expires_at,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def is_token_blacklisted(db: Session, token: str) -> bool:
    token_hash = hash_token(token)
    item = db.query(TokenBlacklist).filter(TokenBlacklist.token_hash == token_hash).first()
    if not item:
        return False

    now_utc = datetime.now(timezone.utc)
    expires_utc = _normalize_utc(item.expires_at)

    # Token blacklist dianggap valid selama token aslinya belum melewati expiry.
    if expires_utc and expires_utc > now_utc:
        return True
    return False

# --- User CRUD ---
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def get_all_users(db: Session):
    return db.query(User).all()


def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, password_hash=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    update_data = user.model_dump(exclude_unset=True)
    if "password" in update_data:
        hashed_password = get_password_hash(update_data.pop("password"))
        db_user.password_hash = hashed_password
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# --- Question CRUD ---
def get_question(db: Session, question_id: int):
    return db.query(Question).filter(Question.id == question_id).first()

def get_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Question).offset(skip).limit(limit).all()

def get_all_questions(db: Session):
    return db.query(Question).all()


def create_question(db: Session, question: QuestionCreate):
    # Generate ID random 6 digit (100000 - 999999)
    while True:
        random_id = random.randint(100000, 999999)
        # Cek apakah ID sudah ada di DB
        exists = db.query(Question).filter(Question.id == random_id).first()
        if not exists:
            break
            
    db_question = Question(id=random_id, **question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def update_question(db: Session, question_id: int, question: QuestionUpdate):
    db_question = get_question(db, question_id)
    if not db_question:
        return None
    for key, value in question.model_dump(exclude_unset=True).items():
        setattr(db_question, key, value)
    db.commit()
    db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = get_question(db, question_id)
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question

# --- Occupation CRUD ---
def get_occupation(db: Session, occupation_id: int):
    return db.query(OccupationRiasec).filter(OccupationRiasec.id == occupation_id).first()

def get_occupations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(OccupationRiasec).offset(skip).limit(limit).all()

def get_all_occupations(db: Session):
    return db.query(OccupationRiasec).all()


def create_occupation(db: Session, occupation: OccupationCreate):
    # Generate ID random 6 digit (100000 - 999999)
    while True:
        random_id = random.randint(100000, 999999)
        # Cek apakah ID sudah ada di DB
        exists = db.query(OccupationRiasec).filter(OccupationRiasec.id == random_id).first()
        if not exists:
            break
            
    db_occupation = OccupationRiasec(id=random_id, **occupation.model_dump())
    db.add(db_occupation)
    db.commit()
    db.refresh(db_occupation)
    return db_occupation


def update_occupation(db: Session, occupation_id: int, occupation: OccupationUpdate):
    db_occupation = get_occupation(db, occupation_id)
    if not db_occupation:
        return None
    for key, value in occupation.model_dump(exclude_unset=True).items():
        setattr(db_occupation, key, value)
    db.commit()
    db.refresh(db_occupation)
    return db_occupation

def delete_occupation(db: Session, occupation_id: int):
    db_occupation = get_occupation(db, occupation_id)
    if db_occupation:
        db.delete(db_occupation)
        db.commit()
    return db_occupation
