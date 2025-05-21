import logging

import httpx
from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas import InferenceRequest, InferenceResponse

router = APIRouter(prefix="/inference", tags=["inference"])


@router.post(
    "/run",
    response_model=InferenceResponse,
)
async def run_inference(payload: InferenceRequest) -> InferenceResponse:
    """
    Принимает текст (жалобы, историю болезни и т.п.),
    пересылает его в ML‑микросервис и возвращает результат.
    """
    ml_url = settings.ML_HOST + "/api/v1/model/predict"

    logging.info(ml_url)

    patient_gender = "Мужчина" if payload.gender == "male" else "Женщина"

    prompt = f"{patient_gender}, {payload.age} лет, {payload.complaints}"

    try:
        async with httpx.AsyncClient(timeout=40.0) as client:
            resp = await client.post(
                ml_url,
                params={"text": prompt},
            )
        resp.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=400,
            detail=f"ML service error: {exc.response.text}",
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot connect to ML service: {exc}",
        )

    data = resp.json()
    return InferenceResponse(**data)
