from pydantic import BaseModel

from model.enums import UserRole


class UserRegistrationResponse(BaseModel):
    id: int
    email: str
    role: UserRole

    class Config:
        from_attributes = True
