from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import schemas, crud

router = APIRouter()

# --- Users ---
@router.post("/users/", response_model=schemas.UserResponse, tags=["Users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@router.get("/users/", response_model=List[schemas.UserResponse], tags=["Users"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/users/all", response_model=List[schemas.UserResponse], tags=["Users"])
def read_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)


@router.get("/users/{user_id}", response_model=schemas.UserResponse, tags=["Users"])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/username/{username}", response_model=schemas.UserResponse, tags=["Users"])
def read_user_by_username(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.put("/users/{user_id}", response_model=schemas.UserResponse, tags=["Users"])
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/users/{user_id}", response_model=schemas.UserResponse, tags=["Users"])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# --- Questions ---
@router.post("/questions/", response_model=schemas.QuestionResponse, tags=["Questions"])
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db=db, question=question)

@router.get("/questions/", response_model=List[schemas.QuestionResponse], tags=["Questions"])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_questions(db, skip=skip, limit=limit)

@router.get("/questions/all", response_model=List[schemas.QuestionResponse], tags=["Questions"])
def read_all_questions(db: Session = Depends(get_db)):
    return crud.get_all_questions(db)


@router.get("/questions/{question_id}", response_model=schemas.QuestionResponse, tags=["Questions"])
def read_question(question_id: int, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.put("/questions/{question_id}", response_model=schemas.QuestionResponse, tags=["Questions"])
def update_question(question_id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.update_question(db, question_id, question)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.delete("/questions/{question_id}", response_model=schemas.QuestionResponse, tags=["Questions"])
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = crud.delete_question(db, question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question


# --- Occupations ---
@router.post("/occupations/", response_model=schemas.OccupationResponse, tags=["Occupations"])
def create_occupation(occupation: schemas.OccupationCreate, db: Session = Depends(get_db)):
    return crud.create_occupation(db=db, occupation=occupation)

@router.get("/occupations/", response_model=List[schemas.OccupationResponse], tags=["Occupations"])
def read_occupations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_occupations(db, skip=skip, limit=limit)

@router.get("/occupations/all", response_model=List[schemas.OccupationResponse], tags=["Occupations"])
def read_all_occupations(db: Session = Depends(get_db)):
    return crud.get_all_occupations(db)


@router.get("/occupations/{occupation_id}", response_model=schemas.OccupationResponse, tags=["Occupations"])
def read_occupation(occupation_id: int, db: Session = Depends(get_db)):
    db_occupation = crud.get_occupation(db, occupation_id=occupation_id)
    if db_occupation is None:
        raise HTTPException(status_code=404, detail="Occupation not found")
    return db_occupation

@router.put("/occupations/{occupation_id}", response_model=schemas.OccupationResponse, tags=["Occupations"])
def update_occupation(occupation_id: int, occupation: schemas.OccupationUpdate, db: Session = Depends(get_db)):
    db_occupation = crud.update_occupation(db, occupation_id, occupation)
    if db_occupation is None:
        raise HTTPException(status_code=404, detail="Occupation not found")
    return db_occupation

@router.delete("/occupations/{occupation_id}", response_model=schemas.OccupationResponse, tags=["Occupations"])
def delete_occupation(occupation_id: int, db: Session = Depends(get_db)):
    db_occupation = crud.delete_occupation(db, occupation_id)
    if db_occupation is None:
        raise HTTPException(status_code=404, detail="Occupation not found")
    return db_occupation
