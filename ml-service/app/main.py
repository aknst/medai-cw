import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from sqlmodel import SQLModel

from .database import engine
from .initial_data import load_initial_data
from .routes import inference
from .services.ml_service import MLService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    """Initialize services before app starts"""
    # Initialize ML Service
    try:
        logger.info("Initializing ML Service...")
        MLService()
        logger.info("ML Service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ML Service: {str(e)}")
        raise

    try:
        logger.info("Initializing database...")
        SQLModel.metadata.create_all(engine)
        try:
            load_initial_data()
        except Exception as e:
            raise RuntimeError(f"Failed to load initial data: {str(e)}") from e
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise

    yield


app = FastAPI(
    title="MedAI ML Service API",
    description="API для определения диагноза и рекомендаций",
    lifespan=lifespan,
    version="0.0.1",
)

app.include_router(inference.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")
