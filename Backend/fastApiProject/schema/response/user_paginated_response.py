from pydantic import BaseModel

from model.enums import UserRole


class UserPaginatedResponse(BaseModel):
    id: int
    email: str
    approved: bool
    role: UserRole

    class Config:
        from_attributes = True
