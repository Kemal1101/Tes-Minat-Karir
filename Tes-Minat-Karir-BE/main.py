from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api_crud import auth_router, router as crud_router
from app.api.inference import router as inference_router
from app.database import Base, engine
from app import models
from app.services.expert_system import cache

# Konfigurasi logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    cache.load_data()
    yield 
    cache.clear()
    logger.info("Server dimatikan, memori dibersihkan.")

app = FastAPI(
    title="RIASEC Career Profiler API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to RIASEC Career Profiler API"}

app.include_router(auth_router, prefix="/api/v1")
app.include_router(crud_router, prefix="/api/v1")
app.include_router(inference_router, prefix="/api")
