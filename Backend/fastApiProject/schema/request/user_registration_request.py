from pydantic import BaseModel

from model.enums import UserRole


class UserRegistrationRequest(BaseModel):
    email: str
    password: str
    role: UserRole
    latitude: float | None = None
    longitude: float | None = None

    class Config:
        from_attributes = True
