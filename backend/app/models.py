import uuid
from datetime import date, datetime, timezone
from enum import Enum as PyEnum

from sqlmodel import Field, Relationship, SQLModel


class UserRole(str, PyEnum):
    patient = "patient"
    doctor = "doctor"


class UserGender(str, PyEnum):
    male = "male"
    female = "female"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = Field(default=UserRole.patient)
    gender: UserGender = Field(default=UserGender.male)
    full_name: str | None = Field(default=None, max_length=255)
    birth_date: date | None = None

    patient_appointments: list["Appointment"] = Relationship(
        back_populates="patient",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.patient_id]"},
    )
    doctor_appointments: list["Appointment"] = Relationship(
        back_populates="doctor",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.doctor_id]"},
    )


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

    patient_id: uuid.UUID | None = Field(foreign_key="users.id")
    doctor_id: uuid.UUID | None = Field(foreign_key="users.id", default=None)

    patient: User | None = Relationship(
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
