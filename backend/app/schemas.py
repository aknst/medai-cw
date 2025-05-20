import uuid
from datetime import date, datetime

from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from app.models import AppointmentStatus, UserGender, UserRole

# ————— User schemas —————


class UserBase(SQLModel):
    email: EmailStr = Field(max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = Field(default=UserRole.patient)
    gender: UserGender = Field(default=UserGender.male)
    full_name: str | None = Field(default=None, max_length=255)
    birth_date: date | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)
    birth_date: date | None
    gender: UserGender = Field(default=UserGender.male)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    birth_date: date | None = None
    gender: UserGender | None = None


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# ————— Appointment schemas —————


class AppointmentBase(SQLModel):
    complaints: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None
    status: AppointmentStatus = Field(default=AppointmentStatus.pending)


class AppointmentCreatePatient(SQLModel):
    complaints: str = Field(..., min_length=1, description="Жалобы пациента")
    doctor_id: uuid.UUID = Field(default=None, description="(необязательно) UUID врача")


class AppointmentCreateDoctor(SQLModel):
    patient_id: uuid.UUID = Field(..., description="UUID пациента")
    complaints: str | None = Field(default=None, description="Жалобы пациента")
    doctor_diagnosis: str | None = Field(default=None, description="Диагноз врача")
    doctor_recommendations: str | None = Field(
        default=None, description="Рекомендации врача"
    )
    nlp_diagnosis: str | None = Field(default=None, description="Диагноз от NLP")
    nlp_recommendations: str | None = Field(
        default=None, description="Рекомендации от NLP"
    )


class AppointmentUpdate(SQLModel):
    complaints: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None
    status: AppointmentStatus | None = None


class AppointmentUser(SQLModel):
    id: uuid.UUID
    full_name: str | None
    email: str
    birth_date: date | None
    gender: UserGender | None


class AppointmentPublic(AppointmentBase):
    id: uuid.UUID
    patient_id: uuid.UUID | None
    doctor_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    patient: AppointmentUser | None
    doctor: AppointmentUser | None


class AppointmentsPublic(SQLModel):
    data: list[AppointmentPublic]
    count: int


# ————— Inference schemas —————


class InferenceRequest(SQLModel):
    gender: UserGender
    age: int
    complaints: str


class InferenceResponse(SQLModel):
    diagnosis: str
    recommendations: str


# ————— Base schemas —————


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
