from pydantic import BaseModel
from typing import Optional, List

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Question Schemas ---
class QuestionBase(BaseModel):
    text: str
    category: str
    cf_pakar: float
    keywords: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    category: Optional[str] = None
    cf_pakar: Optional[float] = None
    keywords: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True

# --- Occupation Schemas ---
class OccupationBase(BaseModel):
    interest_code: Optional[str] = None
    job_zone: Optional[str] = None
    code: Optional[str] = None
    occupation: Optional[str] = None

class OccupationCreate(OccupationBase):
    pass

class OccupationUpdate(BaseModel):
    interest_code: Optional[str] = None
    job_zone: Optional[str] = None
    code: Optional[str] = None
    occupation: Optional[str] = None

class OccupationResponse(OccupationBase):
    id: int

    class Config:
        from_attributes = True
