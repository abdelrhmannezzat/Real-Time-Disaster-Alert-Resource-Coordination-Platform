from pydantic import BaseModel

from model.enums import UserRole


class UserRegistrationRequest(BaseModel):
    email: str
    password: str
    role: UserRole

    class Config:
        from_attributes = True
