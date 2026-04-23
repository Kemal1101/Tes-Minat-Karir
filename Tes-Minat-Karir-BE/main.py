from app.engine.logic import app
from app.api_crud import router as crud_router

app.include_router(crud_router, prefix="/api/v1")
