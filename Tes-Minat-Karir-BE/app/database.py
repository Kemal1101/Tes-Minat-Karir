import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Mengambil URL dari file .env
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Gunakan engine SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency untuk mendapatkan session database di endpoint
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()