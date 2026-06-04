import os
import bcrypt
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas, models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/login", auto_error=False)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({
        "exp": expire,
        "jti": str(uuid4()),
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str, verify_exp: bool = True) -> dict:
    options = None
    if not verify_exp:
        options = {"verify_exp": False}
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options=options)


def get_token_expiration(payload: dict) -> datetime:
    exp = payload.get("exp")
    if isinstance(exp, datetime):
        if exp.tzinfo is None:
            return exp.replace(tzinfo=timezone.utc)
        return exp.astimezone(timezone.utc)
    if isinstance(exp, (int, float)):
        return datetime.fromtimestamp(exp, tz=timezone.utc)
    raise JWTError("Token exp claim tidak valid")


def revoke_access_token(db: Session, token: str) -> str | None:
    payload = decode_access_token(token, verify_exp=True)
    expires_at = get_token_expiration(payload)
    username = payload.get("sub")

    user_id = None
    if username:
        user = crud.get_user_by_username(db, username=username)
        if user:
            user_id = user.id

    crud.blacklist_token(
        db=db,
        token=token,
        user_id=user_id,
        expires_at=expires_at,
    )
    return username

async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Tidak dapat memvalidasi kredensial",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if crud.is_token_blacklisted(db, token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sudah tidak berlaku (logout)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(token, verify_exp=True)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
        
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User tidak memiliki akses (bukan Admin)"
        )
    return current_user
