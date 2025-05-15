from sqlmodel import Field, SQLModel


class Recommendation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    label: str = Field(index=True, unique=True)
    data: str
