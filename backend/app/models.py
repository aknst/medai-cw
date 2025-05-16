import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlmodel import Field, Relationship, SQLModel


class UserRole(str, PyEnum):
    patient = "patient"
    doctor = "doctor"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = Field(default=UserRole.patient)
    full_name: str | None = Field(default=None, max_length=255)

    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)

    patient_appointments: list["Appointment"] = Relationship(
        back_populates="patient",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.patient_id]"},
    )
    doctor_appointments: list["Appointment"] = Relationship(
        back_populates="doctor",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.doctor_id]"},
    )


class Item(SQLModel, table=True):
    __tablename__ = "items"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)

    owner_id: uuid.UUID = Field(
        foreign_key="users.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


class AppointmentStatus(str, PyEnum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    complaints: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None

    status: AppointmentStatus = Field(default=AppointmentStatus.pending)

    patient_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    doctor_id: uuid.UUID | None = Field(foreign_key="users.id", default=None)

    patient: User = Relationship(
        back_populates="patient_appointments",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.patient_id]"},
    )
    doctor: User | None = Relationship(
        back_populates="doctor_appointments",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.doctor_id]"},
    )

    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
