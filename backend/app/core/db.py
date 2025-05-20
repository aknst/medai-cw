from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserRole
from app.schemas import UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    # Create superuser if not exists
    superuser = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not superuser:
        user_in = UserCreate(
            full_name="Администратор",
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            birth_date="2004-05-23",
            role=UserRole.patient,
        )
        crud.create_user(session=session, user_create=user_in)

    # Create patient user if not exists
    patient = session.exec(
        select(User).where(User.email == "patient@gmail.com")
    ).first()
    if not patient:
        patient_in = UserCreate(
            full_name="Пациент",
            email="patient@gmail.com",
            password="patient@gmail.com",
            is_superuser=False,
            birth_date="2004-05-23",
            role=UserRole.patient,
        )
        crud.create_user(session=session, user_create=patient_in)

    # Create doctor user if not exists
    doctor = session.exec(select(User).where(User.email == "doctor@gmail.com")).first()
    if not doctor:
        doctor_in = UserCreate(
            email="doctor@gmail.com",
            password="doctor@gmail.com",
            is_superuser=False,
            birth_date="2004-05-23",
            role=UserRole.doctor,
        )
        crud.create_user(session=session, user_create=doctor_in)
