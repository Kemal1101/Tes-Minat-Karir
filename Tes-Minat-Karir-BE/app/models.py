from sqlalchemy import Column, Integer, BigInteger, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user") # 'admin' atau 'user'

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    category = Column(String) 
    cf_pakar = Column(Float)   
    keywords = Column(String, nullable=True)

class TestHistory(Base):
    __tablename__ = "test_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    holland_code = Column(String)
    result_json = Column(JSON) # Menyimpan detail persentase RIASEC
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OccupationRiasec(Base):
    __tablename__ = "occupations_riasec"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    interest_code = Column("Interest Code", String, nullable=True)
    job_zone = Column("Job Zone", String, nullable=True)
    code = Column("Code", String, nullable=True)
    occupation = Column("Occupation", String, nullable=True)