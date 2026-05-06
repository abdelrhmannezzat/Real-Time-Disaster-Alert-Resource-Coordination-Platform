from pydantic import BaseModel


class UserLoginResponse(BaseModel):
    id: int
    email: str
    access_token: str
    type: str

    class Config:
        from_attributes = True