import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.params import Query
from sqlmodel import func, or_, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Appointment
from app.schemas import (
    AppointmentCreateDoctor,
    AppointmentCreatePatient,
    AppointmentPublic,
    AppointmentsPublic,
    AppointmentStatus,
    AppointmentUpdate,
    Message,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.get("/", response_model=AppointmentsPublic)
def read_appointments(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    search: str | None = Query(
        None,
        title="Search",
        description="Нечувствительный поиск по complaints, doctor_diagnosis, doctor_recommendations",
    ),
    order: str = Query(
        "desc",
        regex="^(asc|desc)$",
        description="Порядок сортировки по updated_at: asc или desc",
    ),
) -> Any:
    """
    Retrieve appointments.

    - superuser sees all
    - doctor sees only their assigned appointments
    - patient sees only their own appointments

    Параметры:
    - `search` — нечувствительный поиск по полям complaints, doctor_diagnosis, doctor_recommendations
    - `order` — направление сортировки по updated_at (`asc` или `desc`)
    - `skip`, `limit` — для пагинации
    """
    stmt_count = select(func.count()).select_from(Appointment)
    stmt_items = select(Appointment)

    if not current_user.is_superuser:
        if current_user.role == "doctor":
            stmt_count = stmt_count.where(Appointment.doctor_id == current_user.id)
            stmt_items = stmt_items.where(Appointment.doctor_id == current_user.id)
        else:
            stmt_count = stmt_count.where(Appointment.patient_id == current_user.id)
            stmt_items = stmt_items.where(Appointment.patient_id == current_user.id)

    if search:
        pattern = f"%{search}%"
        stmt_count = stmt_count.where(
            or_(
                Appointment.complaints.ilike(pattern),
                Appointment.doctor_diagnosis.ilike(pattern),
                Appointment.doctor_recommendations.ilike(pattern),
            )
        )
        stmt_items = stmt_items.where(
            or_(
                Appointment.complaints.ilike(pattern),
                Appointment.doctor_diagnosis.ilike(pattern),
                Appointment.doctor_recommendations.ilike(pattern),
            )
        )

    if order == "asc":
        stmt_items = stmt_items.order_by(Appointment.updated_at.asc())
    else:
        stmt_items = stmt_items.order_by(Appointment.updated_at.desc())

    total = session.exec(stmt_count).one()
    items = session.exec(stmt_items.offset(skip).limit(limit)).all()

    return AppointmentsPublic(data=items, count=total)


@router.get("/{appointment_id}", response_model=AppointmentPublic)
def read_appointment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_id: uuid.UUID,
) -> Any:
    """
    Get one appointment by ID.
    """
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if not current_user.is_superuser:
        if current_user.role == "doctor":
            if appointment.doctor_id != current_user.id:
                raise HTTPException(status_code=403, detail="Forbidden")
        else:  # patient
            if appointment.patient_id != current_user.id:
                raise HTTPException(status_code=403, detail="Forbidden")

    return appointment


@router.post(
    "/patient",
    response_model=AppointmentPublic,
)
def create_appointment_patient(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_in: AppointmentCreatePatient,
) -> Any:
    """
    Пациент создаёт приём:
    - задаёт жалобы
    - может опционально указать doctor_id
    - статус ставится в 'В ожидании'
    """
    if current_user.role != "patient" and not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Только пациенты могут создавать приёмы здесь"
        )

    appointment = Appointment(
        complaints=appointment_in.complaints,
        patient_id=current_user.id,
        doctor_id=appointment_in.doctor_id,
        status=AppointmentStatus.pending,
    )
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.post(
    "/doctor",
    response_model=AppointmentPublic,
)
def create_appointment_doctor(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_in: AppointmentCreateDoctor,
) -> Any:
    """
    Врач создаёт приём:
    - указывает patient_id
    - может заполнить остальные поля
    - статус сразу 'Завершен'
    """
    if current_user.role != "doctor" and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    appointment = Appointment(
        patient_id=appointment_in.patient_id,
        doctor_id=current_user.id,
        complaints=appointment_in.complaints,
        nlp_diagnosis=appointment_in.nlp_diagnosis,
        nlp_recommendations=appointment_in.nlp_recommendations,
        doctor_diagnosis=appointment_in.doctor_diagnosis,
        doctor_recommendations=appointment_in.doctor_recommendations,
        status=AppointmentStatus.completed,
    )
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentPublic)
def update_appointment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_id: uuid.UUID,
    appointment_in: AppointmentUpdate,
) -> Any:
    """
    Doctor updates an appointment (fills NLP fields, diagnosis, recommendations,
    changes status to Завершен or Отменен).
    """
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if not current_user.is_superuser:
        if current_user.role != "doctor" or (
            appointment.doctor_id is not None
            and appointment.doctor_id != current_user.id
        ):
            raise HTTPException(status_code=400, detail="Not enough permissions")

    data = appointment_in.model_dump(exclude_unset=True)
    appointment.sqlmodel_update(data)
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", response_model=Message)
def delete_appointment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_id: uuid.UUID,
) -> Any:
    """
    Delete appointment. Only superuser or patient-owner may delete.
    """
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if not current_user.is_superuser:
        if appointment.patient_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")

    session.delete(appointment)
    session.commit()
    return Message(message="Appointment deleted successfully")
