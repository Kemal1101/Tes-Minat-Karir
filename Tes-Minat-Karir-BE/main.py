from app.engine.logic import app
from app.api_crud import auth_router, router as crud_router
from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(crud_router, prefix="/api/v1")
