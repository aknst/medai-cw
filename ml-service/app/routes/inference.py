import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models import Recommendation
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1")


class PredictionResponse(BaseModel):
    diagnosis: str
    recommendations: str


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    operation_id="predict",
    summary="Определение диагноза и рекомендаций",
    tags=["Inference"],
    responses={
        200: {"description": "Successful prediction"},
        404: {"description": "Diagnosis or recommendations not found"},
        500: {"description": "Internal server error"},
    },
)
async def predict_disease(
    text: str, session: Session = Depends(get_session)
) -> dict[str, str]:
    """
    Предсказывает диагноз на основе введенного текста.

    Возвращается:
    - диагноз: название диагноза
    - рекомендации: рекомендации по лечению (может быть пустым)
    """
    try:
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Input text cannot be empty",
            )

        disease = ml_service.predict(text)
        # logger.info(f"Predicted diagnosis: {disease}")

        recommendation = session.exec(
            select(Recommendation).where(Recommendation.label == disease)
        ).first()

        response = {"diagnosis": disease}

        if not recommendation or not recommendation.data.strip():
            response["recommendations"] = ""
            logger.warning(f"No recommendations found for disease: {disease}")
        else:
            response["recommendations"] = recommendation.data.strip()

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during prediction",
        ) from e
