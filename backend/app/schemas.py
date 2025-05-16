import uuid
from datetime import datetime
from enum import Enum as PyEnum

from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from app.models import UserRole

# ————— User schemas —————


class UserBase(SQLModel):
    email: EmailStr = Field(max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = Field(default=UserRole.patient)
    full_name: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# ————— Item schemas —————


class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# ————— Appointment schemas —————


class AppointmentStatus(str, PyEnum):
    pending = "В ожидании"
    completed = "Завершен"
    cancelled = "Отменен"


class AppointmentBase(SQLModel):
    complaints: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None
    status: AppointmentStatus = Field(default=AppointmentStatus.pending)


class AppointmentCreate(AppointmentBase):
    complaints: str = Field(..., min_length=1)


class AppointmentUpdate(SQLModel):
    complaints: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None
    status: AppointmentStatus | None = None


class AppointmentPublic(AppointmentBase):
    id: uuid.UUID
    patient_id: uuid.UUID
    doctor_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class AppointmentsPublic(SQLModel):
    data: list[AppointmentPublic]
    count: int


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
